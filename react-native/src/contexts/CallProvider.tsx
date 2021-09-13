import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  createContext,
} from 'react'
import Daily, {
  DailyCall, DailyCallOptions, DailyEventErrorObject, DailyEventObjectActiveSpeakerChange,
  DailyEventObjectAppMessage, DailyEventObjectParticipant, DailyEventObjectParticipants,
  DailyEventObjectTrack, DailyParticipant
} from '@daily-co/react-native-daily-js'
import { AccountType, AppMessage, Room, Token } from '../models'
import { CallContextInterface, CallState } from './CallContext'

export const CallProvider = ({children}) => {
  const [view, setView] = useState<CallState>(CallState.PREJOIN)
  const [callFrame, setCallFrame] = useState<DailyCall>(null)
  const [participants, setParticipants] = useState<DailyParticipant[]>([])
  const [room, setRoom] = useState<Room>(null)
  const [error, setError] = useState<string>(null)
  const [roomExp, setRoomExp] = useState<number>(null)
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>(null)
  const [updateParticipants, setUpdateParticipants] = useState(null)

  const createRoom = async (): Promise<Room> => {
    console.log('creating a new room')
    try {
      const response = await fetch(
        'https://app.enepti.com/.netlify/functions/room',
        {
          method: 'POST',
          body: JSON.stringify({})
        },
      )
      const data = await response.json()
      console.log('functions/room response', JSON.stringify(data))
      return Room.fromJSON(data)
    } catch (err) {
      console.error('room function error', err)
      throw new Error(err)
    }
  }

  const createToken = async (roomName: string): Promise<Token> => {
    console.log('creating token', roomName)
    if (!roomName) {
      setError('Eep! We could not create a token')
      return null
    }

    try {
      const response = await fetch(
        'https://app.enepti.com/.netlify/functions/token',
        {
          method: 'POST',
          body: JSON.stringify({properties: {room_name: roomName}}),
        },
      )
      const data = await response.json()
      console.log('functions/token response', JSON.stringify(data))
      return Token.fromJSON(data)
    } catch (err) {
      console.error('token function error', err)
      throw new Error(err)
    }
  }

  const joinRoom = async ({username, name, moderator}:
      { username: string, name: string, moderator?: boolean}) => {
    if (callFrame) {
      callFrame.leave()
    }

    let roomInfo: Room
    /**
     * The first person to join will need to create the room first
     */
    if (name) {
      roomInfo = new Room()
      roomInfo.name = name
    } else if (!moderator) {
      try {
        roomInfo = await createRoom()
        console.log('room created', roomInfo)
      } catch (e) {
        console.error(e)
        setError('Eep! creating room failed.')
        setView(CallState.PREJOIN)
      }
    }
    setRoom(roomInfo)

    /**
     * When a moderator makes someone else a moderator,
     * they first leave and then rejoin with a token.
     * In that case, we create a token for the new mod here.
     */
    let newToken: Token
    if (moderator) {
      // create a token for new moderators
      try {
        newToken = await createToken(roomInfo?.name)
        console.log('token created', newToken)
      } catch (e) {
        console.error(e)
        setError('Eep! creating token for room failed.')
      }
    }

    console.log('creating daily call object', roomInfo?.name, username)
    const call: DailyCall = Daily.createCallObject()

    const options: DailyCallOptions = {
      url: `https://enepti.daily.co/${roomInfo?.name}`,
    }
    if (roomInfo?.token) {
      options.token = roomInfo?.token
    }
    if (newToken?.token) {
      options.token = newToken.token
    }

    console.log('let\'s join the call', JSON.stringify(options))
    try {
      await call.join(options)

      console.log('call join success', options.token)

      setError(null)
      setCallFrame(call)
      /**
       * Now mute, so everyone joining is muted by default.
       *
       * IMPROVEMENT: track a speaker's muted state so if they
       * are rejoining as a moderator, they don't have to turn
       * their mic back on.
       */
      call.setLocalAudio(false)

      setView(CallState.INCALL)
    } catch (err) {
      console.error('call join error', err)
      if (err) {
        setError(err)
      }
    }

    /**
     * IMPROVEMENT: Every room should have a moderator. We should
     * prevent people from joining (or kick them out after joining)
     * if a mod isn't present. Since these demo rooms only last ten
     * minutes we're not currently checking this.
     */
  }

  const handleJoinedMeeting = (evt: DailyEventObjectParticipants | any) => {
    setUpdateParticipants(`joined-${evt?.participants?.local.user_id}-${Date.now()}`)
    setView(CallState.INCALL)
    console.log('[JOINED MEETING]', evt?.participants?.local.user_id)
  }
  const handleParticipantJoinedOrUpdated = (evt: DailyEventObjectParticipant | any) => {
    setUpdateParticipants(`updated-${evt?.participant?.user_id}-${Date.now()}`)
    console.log('[PARTICIPANT JOINED/UPDATED]', evt.participant)
  }
  const handleParticipantLeft = (evt: DailyEventObjectParticipant | any) => {
    setUpdateParticipants(`left-${evt?.participant?.user_id}-${Date.now()}`)
    console.log('[PARTICIPANT LEFT]', evt)
  }
  const handleActiveSpeakerChange = (evt: DailyEventObjectActiveSpeakerChange | any) => {
    console.log('[ACTIVE AccountType.SPEAKER CHANGE]', evt)
    setActiveSpeakerId(evt?.activeSpeaker?.peerId)
  }

  const playTrack = (evt: DailyEventObjectTrack | any) => {
    console.log(
      '[TRACK STARTED]',
      evt.participant && evt.participant.session_id,
    )
    setUpdateParticipants(
      `track-started-${evt?.participant?.user_id}-${Date.now()}`,
    )
  }
  const destroyTrack = (evt: DailyEventObjectTrack | any) => {
    console.log('[DESTROY TRACK]', evt)
    setUpdateParticipants(
      `track-stopped-${evt?.participant?.user_id}-${Date.now()}`,
    )
  }

  const getAccountType = (username: string): AccountType => {
    const type = username?.slice(-3)
    return type in AccountType ? type as AccountType : null
  }

  const leaveCall = useCallback(async (): Promise<void> => {
    if (!callFrame) return
    async function leave() {
      await callFrame.leave()
    }
    leave()
    setView(CallState.PREJOIN)
  }, [callFrame])

  const removeFromCall = useCallback(
    (participant: DailyParticipant): void => {
      if (!callFrame) return
      console.log('[EJECTING PARTICIPANT]', participant?.user_id)
      callFrame.sendAppMessage({msg: AppMessage.FORCE_EJECT}, participant?.session_id)
      setUpdateParticipants(
        `eject-participant-${participant?.user_id}-${Date.now()}`,
      )
    },
    [callFrame],
  )

  const endCall = useCallback(async (): Promise<void> => {
    participants.forEach((p) => removeFromCall(p))
    leaveCall()
  }, [participants, removeFromCall, leaveCall])

  // return name without account type
  const displayName = (username: string): string => {
    return username?.slice(0, username.length - 4) || ''
  }

  const updateUsername = useCallback(
    (newAccountType: AccountType): void => {
      /**
       * In case the user had their hand raised, let's make
       * sure to remove that emoji before updating the account type.
       */
      const split = callFrame?.participants()?.local?.user_name.split('✋ ')
      const handRemoved = split.length === 2 ? split[1] : split[0]

      const display = displayName(handRemoved)
      /**
       * The display name is what the participant provided on sign up.
       * We append the account type to their user name so to update
       * the account type we can update the last few letters.
       */
      callFrame.setUserName(`${display}_${newAccountType}`)
    },
    [callFrame],
  )

  const handleMute = useCallback(
    (p: DailyParticipant) => {
      if (!callFrame) return
      console.log('[MUTING]')

      if (p?.user_id === 'local') {
        callFrame.setLocalAudio(false)
      } else {
        callFrame.updateParticipant(p?.session_id, {
          setAudio: false,
        })
      }
      setUpdateParticipants(`unmute-${p?.user_id}-${Date.now()}`)
    },
    [callFrame],
  )
  const handleUnmute = useCallback(
    (p: DailyParticipant) => {
      if (!callFrame) return
      console.log('UNMUTING')

      if (p?.user_id === 'local') {
        callFrame.setLocalAudio(true)
      } else {
        callFrame.updateParticipant(p?.session_id, {
          setAudio: true,
        })
      }
      setUpdateParticipants(`unmute-${p?.user_id}-${Date.now()}`)
    },
    [callFrame],
  )
  const raiseHand = useCallback(
    (p: DailyParticipant) => {
      if (!callFrame) return
      console.log('RAISING HAND')
      callFrame.setUserName(`✋ ${p?.user_name}`)
      setUpdateParticipants(`raising-hand-${p?.user_id}-${Date.now()}`)
    },
    [callFrame],
  )
  const lowerHand = useCallback(
    (p: DailyParticipant) => {
      if (!callFrame) return
      console.log('UNRAISING HAND')
      const split = p?.user_name.split('✋ ')
      const username = split.length === 2 ? split[1] : split[0]
      callFrame.setUserName(username)
      setUpdateParticipants(`unraising-hand-${p?.user_id}-${Date.now()}`)
    },
    [callFrame],
  )

  const changeAccountType = useCallback(
    (participant: DailyParticipant, accountType: AccountType): void => {
      if (!participant || !Object.values(AccountType).includes(accountType))
        return
      /**
       * In case someone snuck in through a direct link, give their username
       * the correct formatting
       */
      let userName
      if (!getAccountType(participant?.user_name)) {
        userName = participant?.user_name + `_${accountType}`
      }
      userName = displayName(participant?.user_name) + `_${accountType}`
      /**
       * Direct message the participant their account type has changed.
       * The participant will then update their own username with setUserName().
       * setUserName will trigger a participant updated event for everyone
       * to then update the participant list in their local state.
       */
      const msg =
        accountType === AccountType.MODERATOR
          ? AppMessage.MAKE_MODERATOR
          : accountType === AccountType.SPEAKER
          ? AppMessage.MAKE_SPEAKER
          : AppMessage.MAKE_LISTENER

      console.log('[UPDATING ACCOUNT TYPE]')
      if (msg === AppMessage.MAKE_LISTENER) {
        handleMute(participant)
      }
      callFrame.sendAppMessage(
        {userName, id: participant?.user_id, msg},
        participant?.session_id,
      )
    },
    [getAccountType, displayName, handleMute, callFrame],
  )

  useEffect(() => {
    const handleAppMessage = async (evt: DailyEventObjectAppMessage) => {
      console.log('[APP MESSAGE]', evt)
      try {
        switch (evt.data.msg) {
          case AppMessage.MAKE_MODERATOR:
            console.log('[LEAVING]')
            await callFrame.leave()
            console.log('[REJOINING AS AccountType.MODERATOR]')
            let username = evt?.data?.userName
            if (username?.includes('✋')) {
              const split = username.split('✋ ')
              username = split.length === 2 ? split[1] : split[0]
            }
            joinRoom({
              moderator: true,
              username,
              name: room?.name,
            })
            break
          case AppMessage.MAKE_SPEAKER:
            updateUsername(AccountType.SPEAKER)
            break
          case AppMessage.MAKE_LISTENER:
            updateUsername(AccountType.LISTENER)
            break
          case AppMessage.FORCE_EJECT:
            leaveCall()
            break
        }
      } catch (e) {
        console.error(e)
      }
    }

    const showError = (e: DailyEventErrorObject) => {
      console.log('[ERROR]')
      console.warn(e)
    }

    if (!callFrame) return
    callFrame.on('error', showError)
    callFrame.on('joined-meeting', handleJoinedMeeting)
    callFrame.on('participant-joined', handleParticipantJoinedOrUpdated)
    callFrame.on('participant-updated', handleParticipantJoinedOrUpdated)
    callFrame.on('participant-left', handleParticipantLeft)
    callFrame.on('app-message', handleAppMessage)
    callFrame.on('active-speaker-change', handleActiveSpeakerChange)
    callFrame.on('track-started', playTrack)
    callFrame.on('track-stopped', destroyTrack)

    return () => {
      // clean up
      callFrame.off('error', showError)
      callFrame.off('joined-meeting', handleJoinedMeeting)
      callFrame.off('participant-joined', handleParticipantJoinedOrUpdated)
      callFrame.off('participant-updated', handleParticipantJoinedOrUpdated)
      callFrame.off('participant-left', handleParticipantLeft)
      callFrame.off('app-message', handleAppMessage)
      callFrame.off('active-speaker-change', handleActiveSpeakerChange)
      callFrame.off('track-started', playTrack)
      callFrame.off('track-stopped', destroyTrack)
    }
  }, [callFrame, participants, destroyTrack, playTrack, updateUsername])

  /**
   * Update participants for any event that happens
   * to keep the local participants list up to date.
   * We grab the whole participant list to make sure everyone's
   * status is the most up-to-date.
   */
  useEffect(() => {
    if (updateParticipants) {
      console.log('[UPDATING PARTICIPANT LIST]')
      const list = Object.values(callFrame?.participants())
      setParticipants(list)
    }
  }, [updateParticipants, callFrame])

  useEffect(() => {
    if (!callFrame) return
    async function getRoom() {
      console.log('[GETTING ROOM DETAILS]')
      const roomObj = await callFrame?.room()
      const room = Room.fromJSON(roomObj)
      const exp = room?.config?.exp
      setRoom(room)
      if (exp) {
        setRoomExp(exp * 1000 || Date.now() + 1 * 60 * 1000)
      }
    }
    getRoom()
  }, [callFrame])

  return (
    <CallContext.Provider
      value={{
        getAccountType,
        changeAccountType,
        handleMute,
        handleUnmute,
        displayName,
        joinRoom,
        leaveCall,
        endCall,
        removeFromCall,
        raiseHand,
        lowerHand,
        activeSpeakerId,
        error,
        participants,
        room,
        roomExp,
        view,
      }}>
      {children}
    </CallContext.Provider>
  )
}

export const CallContext = createContext<CallContextInterface>(null)

export const useCallState = () => useContext(CallContext)
