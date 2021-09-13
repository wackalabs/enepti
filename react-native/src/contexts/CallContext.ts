import { DailyParticipant } from "@daily-co/react-native-daily-js"
import { AccountType, Room } from '../models'

export enum CallState {
  PREJOIN = 'pre-join',
  INCALL = 'in-call'
}

export type CallContextInterface = {

  getAccountType: (username: string) => AccountType

  changeAccountType: (participant: DailyParticipant, accountType: AccountType) => void,

  handleMute: (participant: DailyParticipant) => void,
  
  handleUnmute: (participant: DailyParticipant) => void,
  
  displayName: (username: string) => string,
  
  joinRoom: ({ username, name, moderator }:
    { username: string, name: string, moderator?: boolean }) => Promise<void>,
  
  leaveCall: () => Promise<void>
  
  endCall: () => Promise<void>,
  
  removeFromCall: (participant: DailyParticipant) => void,
  
  raiseHand: (participant: DailyParticipant) => void,
  
  lowerHand: (participant: DailyParticipant) => void,
  
  activeSpeakerId?: string,
  
  error?: string,
  
  participants: DailyParticipant[],
  
  room?: Room,
  
  roomExp?: number,
  
  view: CallState,

}
