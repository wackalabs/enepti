import React, {useMemo} from 'react'
import {
  Pressable,
  View,
  Text,
  StyleSheet,
} from 'react-native'
import {
  useCallState,
} from '../contexts/CallProvider'
import Participant from './Participant'
import CopyLinkBox from './CopyLinkBox'
import Counter from './Counter'
import theme from '../styles/theme'
import { AccountType } from '../models'
import { DailyParticipant } from '@daily-co/react-native-daily-js'
import { CallState } from '../contexts/CallContext'

const InCall = ({handleLinkPress}) => {
  const {participants, room, view, getAccountType} = useCallState()
  console.log(participants)

  const mods = useMemo(
    () => participants?.filter((p) => p?.owner),
    [participants, getAccountType],
  )

  const speakers: DailyParticipant[] = useMemo(
    (): DailyParticipant[] =>
      participants?.filter((p) => getAccountType(p?.user_name) === AccountType.SPEAKER),
    [participants, getAccountType],
  )
  const local: DailyParticipant = useMemo(
    (): DailyParticipant => participants?.filter((p) => p?.local)[0],
    [participants],
  )

  const listeners = useMemo(() => {
    const l: DailyParticipant[] = participants
      ?.filter((p) => getAccountType(p?.user_name) === AccountType.LISTENER)
      .sort((a, _) => {
        // Move raised hands to front of list
        if (a?.user_name.includes('✋')) return -1
        return 0
      })
    return (
      <View style={styles.listenersContainer}>
        {l?.map((p, i) => (
          <Participant
            participant={p}
            key={p.user_id}
            local={local}
            zIndex={l.length - i}
          />
        ))}
      </View>
    )
  }, [participants, getAccountType])

  const canSpeak = useMemo(() => {
    const s = [...mods, ...speakers]
    return (
      <View style={styles.speakersContainer}>
        {s?.map((p, i) => (
          <Participant participant={p} key={p.user_id} local={local} />
        ))}
      </View>
    )
  }, [mods, speakers])

  return (
    <View
      style={Object.assign({}, styles.container,
        {visibility: view === CallState.INCALL ? 'visible' : 'hidden'},
      )}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Speakers</Text>
          <Counter />
        </View>
        {canSpeak}
        <Text style={styles.headerText}>Listeners</Text>
        {listeners}
      </View>
      <CopyLinkBox
        room={room}
      />
      <Pressable onPress={handleLinkPress}>
        <Text style={styles.link}>Learn more</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    zIndex: 30,
  },
  speakersContainer: {
    flexDirection: 'row',
    borderBottomColor: theme.colors.grey,
    borderBottomWidth: 1,
    marginBottom: 24,
    zIndex: 20,
    flexWrap: 'wrap',
  },
  listenersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: theme.colors.greyDark,
    fontSize: theme.fontSize.xlarge,
  },
  link: {
    fontWeight: '400',
    fontSize: theme.fontSize.med,
    color: theme.colors.greyDark,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})

export default InCall
