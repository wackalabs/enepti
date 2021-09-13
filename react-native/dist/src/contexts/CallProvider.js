"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallState = exports.CallContext = exports.CallProvider = void 0;
const react_1 = __importStar(require("react"));
const react_native_daily_js_1 = __importDefault(require("@daily-co/react-native-daily-js"));
const models_1 = require("../models");
const CallContext_1 = require("./CallContext");
const CallProvider = ({ children }) => {
    const [view, setView] = (0, react_1.useState)(CallContext_1.CallState.PREJOIN);
    const [callFrame, setCallFrame] = (0, react_1.useState)(null);
    const [participants, setParticipants] = (0, react_1.useState)([]);
    const [room, setRoom] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [roomExp, setRoomExp] = (0, react_1.useState)(null);
    const [activeSpeakerId, setActiveSpeakerId] = (0, react_1.useState)(null);
    const [updateParticipants, setUpdateParticipants] = (0, react_1.useState)(null);
    const createRoom = async () => {
        console.log('creating a new room');
        try {
            const response = await fetch('https://app.enepti.com/.netlify/functions/room', {
                method: 'POST',
                body: JSON.stringify({})
            });
            const data = await response.json();
            console.log('functions/room response', JSON.stringify(data));
            return models_1.Room.fromJSON(data);
        }
        catch (err) {
            console.error('room function error', err);
            throw new Error(err);
        }
    };
    const createToken = async (roomName) => {
        console.log('creating token', roomName);
        if (!roomName) {
            setError('Eep! We could not create a token');
            return null;
        }
        try {
            const response = await fetch('https://app.enepti.com/.netlify/functions/token', {
                method: 'POST',
                body: JSON.stringify({ properties: { room_name: roomName } }),
            });
            const data = await response.json();
            console.log('functions/token response', JSON.stringify(data));
            return models_1.Token.fromJSON(data);
        }
        catch (err) {
            console.error('token function error', err);
            throw new Error(err);
        }
    };
    const joinRoom = async ({ username, name, moderator }) => {
        if (callFrame) {
            callFrame.leave();
        }
        let roomInfo;
        /**
         * The first person to join will need to create the room first
         */
        if (name) {
            roomInfo = new models_1.Room();
            roomInfo.name = name;
        }
        else if (!moderator) {
            try {
                roomInfo = await createRoom();
                console.log('room created', roomInfo);
            }
            catch (e) {
                console.error(e);
                setError('Eep! creating room failed.');
                setView(CallContext_1.CallState.PREJOIN);
            }
        }
        setRoom(roomInfo);
        /**
         * When a moderator makes someone else a moderator,
         * they first leave and then rejoin with a token.
         * In that case, we create a token for the new mod here.
         */
        let newToken;
        if (moderator) {
            // create a token for new moderators
            try {
                newToken = await createToken(roomInfo?.name);
                console.log('token created', newToken);
            }
            catch (e) {
                console.error(e);
                setError('Eep! creating token for room failed.');
            }
        }
        console.log('creating daily call object', roomInfo?.name, username);
        const call = react_native_daily_js_1.default.createCallObject();
        const options = {
            url: `https://enepti.daily.co/${roomInfo?.name}`,
        };
        if (roomInfo?.token) {
            options.token = roomInfo?.token;
        }
        if (newToken?.token) {
            options.token = newToken.token;
        }
        console.log('let\'s join the call', JSON.stringify(options));
        try {
            await call.join(options);
            console.log('call join success', options.token);
            setError(null);
            setCallFrame(call);
            /**
             * Now mute, so everyone joining is muted by default.
             *
             * IMPROVEMENT: track a speaker's muted state so if they
             * are rejoining as a moderator, they don't have to turn
             * their mic back on.
             */
            call.setLocalAudio(false);
            setView(CallContext_1.CallState.INCALL);
        }
        catch (err) {
            console.error('call join error', err);
            if (err) {
                setError(err);
            }
        }
        /**
         * IMPROVEMENT: Every room should have a moderator. We should
         * prevent people from joining (or kick them out after joining)
         * if a mod isn't present. Since these demo rooms only last ten
         * minutes we're not currently checking this.
         */
    };
    const handleJoinedMeeting = (evt) => {
        setUpdateParticipants(`joined-${evt?.participants?.local.user_id}-${Date.now()}`);
        setView(CallContext_1.CallState.INCALL);
        console.log('[JOINED MEETING]', evt?.participants?.local.user_id);
    };
    const handleParticipantJoinedOrUpdated = (evt) => {
        setUpdateParticipants(`updated-${evt?.participant?.user_id}-${Date.now()}`);
        console.log('[PARTICIPANT JOINED/UPDATED]', evt.participant);
    };
    const handleParticipantLeft = (evt) => {
        setUpdateParticipants(`left-${evt?.participant?.user_id}-${Date.now()}`);
        console.log('[PARTICIPANT LEFT]', evt);
    };
    const handleActiveSpeakerChange = (evt) => {
        console.log('[ACTIVE AccountType.SPEAKER CHANGE]', evt);
        setActiveSpeakerId(evt?.activeSpeaker?.peerId);
    };
    const playTrack = (evt) => {
        console.log('[TRACK STARTED]', evt.participant && evt.participant.session_id);
        setUpdateParticipants(`track-started-${evt?.participant?.user_id}-${Date.now()}`);
    };
    const destroyTrack = (evt) => {
        console.log('[DESTROY TRACK]', evt);
        setUpdateParticipants(`track-stopped-${evt?.participant?.user_id}-${Date.now()}`);
    };
    const getAccountType = (username) => {
        const type = username?.slice(-3);
        return type in models_1.AccountType ? type : null;
    };
    const leaveCall = (0, react_1.useCallback)(async () => {
        if (!callFrame)
            return;
        async function leave() {
            await callFrame.leave();
        }
        leave();
        setView(CallContext_1.CallState.PREJOIN);
    }, [callFrame]);
    const removeFromCall = (0, react_1.useCallback)((participant) => {
        if (!callFrame)
            return;
        console.log('[EJECTING PARTICIPANT]', participant?.user_id);
        callFrame.sendAppMessage({ msg: models_1.AppMessage.FORCE_EJECT }, participant?.session_id);
        setUpdateParticipants(`eject-participant-${participant?.user_id}-${Date.now()}`);
    }, [callFrame]);
    const endCall = (0, react_1.useCallback)(async () => {
        participants.forEach((p) => removeFromCall(p));
        leaveCall();
    }, [participants, removeFromCall, leaveCall]);
    // return name without account type
    const displayName = (username) => {
        return username?.slice(0, username.length - 4) || '';
    };
    const updateUsername = (0, react_1.useCallback)((newAccountType) => {
        /**
         * In case the user had their hand raised, let's make
         * sure to remove that emoji before updating the account type.
         */
        const split = callFrame?.participants()?.local?.user_name.split('✋ ');
        const handRemoved = split.length === 2 ? split[1] : split[0];
        const display = displayName(handRemoved);
        /**
         * The display name is what the participant provided on sign up.
         * We append the account type to their user name so to update
         * the account type we can update the last few letters.
         */
        callFrame.setUserName(`${display}_${newAccountType}`);
    }, [callFrame]);
    const handleMute = (0, react_1.useCallback)((p) => {
        if (!callFrame)
            return;
        console.log('[MUTING]');
        if (p?.user_id === 'local') {
            callFrame.setLocalAudio(false);
        }
        else {
            callFrame.updateParticipant(p?.session_id, {
                setAudio: false,
            });
        }
        setUpdateParticipants(`unmute-${p?.user_id}-${Date.now()}`);
    }, [callFrame]);
    const handleUnmute = (0, react_1.useCallback)((p) => {
        if (!callFrame)
            return;
        console.log('UNMUTING');
        if (p?.user_id === 'local') {
            callFrame.setLocalAudio(true);
        }
        else {
            callFrame.updateParticipant(p?.session_id, {
                setAudio: true,
            });
        }
        setUpdateParticipants(`unmute-${p?.user_id}-${Date.now()}`);
    }, [callFrame]);
    const raiseHand = (0, react_1.useCallback)((p) => {
        if (!callFrame)
            return;
        console.log('RAISING HAND');
        callFrame.setUserName(`✋ ${p?.user_name}`);
        setUpdateParticipants(`raising-hand-${p?.user_id}-${Date.now()}`);
    }, [callFrame]);
    const lowerHand = (0, react_1.useCallback)((p) => {
        if (!callFrame)
            return;
        console.log('UNRAISING HAND');
        const split = p?.user_name.split('✋ ');
        const username = split.length === 2 ? split[1] : split[0];
        callFrame.setUserName(username);
        setUpdateParticipants(`unraising-hand-${p?.user_id}-${Date.now()}`);
    }, [callFrame]);
    const changeAccountType = (0, react_1.useCallback)((participant, accountType) => {
        if (!participant || !Object.values(models_1.AccountType).includes(accountType))
            return;
        /**
         * In case someone snuck in through a direct link, give their username
         * the correct formatting
         */
        let userName;
        if (!getAccountType(participant?.user_name)) {
            userName = participant?.user_name + `_${accountType}`;
        }
        userName = displayName(participant?.user_name) + `_${accountType}`;
        /**
         * Direct message the participant their account type has changed.
         * The participant will then update their own username with setUserName().
         * setUserName will trigger a participant updated event for everyone
         * to then update the participant list in their local state.
         */
        const msg = accountType === models_1.AccountType.MODERATOR
            ? models_1.AppMessage.MAKE_MODERATOR
            : accountType === models_1.AccountType.SPEAKER
                ? models_1.AppMessage.MAKE_SPEAKER
                : models_1.AppMessage.MAKE_LISTENER;
        console.log('[UPDATING ACCOUNT TYPE]');
        if (msg === models_1.AppMessage.MAKE_LISTENER) {
            handleMute(participant);
        }
        callFrame.sendAppMessage({ userName, id: participant?.user_id, msg }, participant?.session_id);
    }, [getAccountType, displayName, handleMute, callFrame]);
    (0, react_1.useEffect)(() => {
        const handleAppMessage = async (evt) => {
            console.log('[APP MESSAGE]', evt);
            try {
                switch (evt.data.msg) {
                    case models_1.AppMessage.MAKE_MODERATOR:
                        console.log('[LEAVING]');
                        await callFrame.leave();
                        console.log('[REJOINING AS AccountType.MODERATOR]');
                        let username = evt?.data?.userName;
                        if (username?.includes('✋')) {
                            const split = username.split('✋ ');
                            username = split.length === 2 ? split[1] : split[0];
                        }
                        joinRoom({
                            moderator: true,
                            username,
                            name: room?.name,
                        });
                        break;
                    case models_1.AppMessage.MAKE_SPEAKER:
                        updateUsername(models_1.AccountType.SPEAKER);
                        break;
                    case models_1.AppMessage.MAKE_LISTENER:
                        updateUsername(models_1.AccountType.LISTENER);
                        break;
                    case models_1.AppMessage.FORCE_EJECT:
                        leaveCall();
                        break;
                }
            }
            catch (e) {
                console.error(e);
            }
        };
        const showError = (e) => {
            console.log('[ERROR]');
            console.warn(e);
        };
        if (!callFrame)
            return;
        callFrame.on('error', showError);
        callFrame.on('joined-meeting', handleJoinedMeeting);
        callFrame.on('participant-joined', handleParticipantJoinedOrUpdated);
        callFrame.on('participant-updated', handleParticipantJoinedOrUpdated);
        callFrame.on('participant-left', handleParticipantLeft);
        callFrame.on('app-message', handleAppMessage);
        callFrame.on('active-speaker-change', handleActiveSpeakerChange);
        callFrame.on('track-started', playTrack);
        callFrame.on('track-stopped', destroyTrack);
        return () => {
            // clean up
            callFrame.off('error', showError);
            callFrame.off('joined-meeting', handleJoinedMeeting);
            callFrame.off('participant-joined', handleParticipantJoinedOrUpdated);
            callFrame.off('participant-updated', handleParticipantJoinedOrUpdated);
            callFrame.off('participant-left', handleParticipantLeft);
            callFrame.off('app-message', handleAppMessage);
            callFrame.off('active-speaker-change', handleActiveSpeakerChange);
            callFrame.off('track-started', playTrack);
            callFrame.off('track-stopped', destroyTrack);
        };
    }, [callFrame, participants, destroyTrack, playTrack, updateUsername]);
    /**
     * Update participants for any event that happens
     * to keep the local participants list up to date.
     * We grab the whole participant list to make sure everyone's
     * status is the most up-to-date.
     */
    (0, react_1.useEffect)(() => {
        if (updateParticipants) {
            console.log('[UPDATING PARTICIPANT LIST]');
            const list = Object.values(callFrame?.participants());
            setParticipants(list);
        }
    }, [updateParticipants, callFrame]);
    (0, react_1.useEffect)(() => {
        if (!callFrame)
            return;
        async function getRoom() {
            console.log('[GETTING ROOM DETAILS]');
            const roomObj = await callFrame?.room();
            const room = models_1.Room.fromJSON(roomObj);
            const exp = room?.config?.exp;
            setRoom(room);
            if (exp) {
                setRoomExp(exp * 1000 || Date.now() + 1 * 60 * 1000);
            }
        }
        getRoom();
    }, [callFrame]);
    return (react_1.default.createElement(exports.CallContext.Provider, { value: {
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
        } }, children));
};
exports.CallProvider = CallProvider;
exports.CallContext = (0, react_1.createContext)(null);
const useCallState = () => (0, react_1.useContext)(exports.CallContext);
exports.useCallState = useCallState;
//# sourceMappingURL=CallProvider.js.map