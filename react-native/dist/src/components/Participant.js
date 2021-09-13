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
const react_1 = __importStar(require("react"));
const react_native_daily_js_1 = require("@daily-co/react-native-daily-js");
const react_native_1 = require("react-native");
const theme_1 = __importDefault(require("../styles/theme"));
const CallProvider_1 = require("../contexts/CallProvider");
const Menu_1 = __importDefault(require("./Menu"));
const models_1 = require("../models");
const AVATAR_DIMENSION = 104;
const ADMIN_BADGE = '⭐ ';
const initials = (name) => name
    ? name
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
    : '';
const Participant = ({ participant, local, modCount, zIndex }) => {
    const { getAccountType, activeSpeakerId, changeAccountType, displayName, handleMute, handleUnmute, removeFromCall, lowerHand, raiseHand, leaveCall, endCall, } = (0, CallProvider_1.useCallState)();
    const name = displayName(participant?.user_name);
    const menuOptions = (0, react_1.useMemo)(() => {
        const mutedText = participant?.audio ? 'Mute' : 'Unmute';
        const audioAction = participant?.audio
            ? (id) => handleMute(id)
            : (id) => handleUnmute(id);
        /**
         * Determine what the menu options are based on the account type.
         * Listeners can't unmute but can raise their hand to speaker.
         * Moderators can change the status of others but can't have their
         * own status change to speaker or listener.
         * Moderators cannot unmute but can mute.
         */
        let options = [];
        /**
         * If it's the local particpant's menu:
         *  - Mods can unmute themselves and speakers.
         *  - Speakers can unmute themselves.
         *  - Listeners listen. :)
         */
        if (participant?.local &&
            [models_1.AccountType.MODERATOR, models_1.AccountType.SPEAKER].includes(getAccountType(participant?.user_name))) {
            options.push({
                text: mutedText,
                action: () => audioAction(participant),
            });
        }
        /**
         * If it's a remote participant:
         * Mods can only MUTE someone. We don't want
         * people getting unmuted without knowing because
         * it can be a bit invasive 😬
         */
        if (!participant?.local &&
            participant?.audio &&
            getAccountType(local?.user_name) === models_1.AccountType.MODERATOR &&
            [models_1.AccountType.MODERATOR, models_1.AccountType.SPEAKER].includes(getAccountType(participant?.user_name))) {
            options.push({
                text: 'Mute',
                action: () => handleMute(participant),
            });
        }
        switch (getAccountType(participant?.user_name)) {
            case models_1.AccountType.SPEAKER:
                if (!participant?.local) {
                    const o = [
                        {
                            text: 'Make moderator',
                            action: () => changeAccountType(participant, models_1.AccountType.MODERATOR),
                        },
                        {
                            text: 'Make listener',
                            action: () => changeAccountType(participant, models_1.AccountType.LISTENER),
                        },
                        {
                            text: 'Remove from call',
                            action: () => removeFromCall(participant),
                            warning: true,
                        },
                    ];
                    options = [...options, ...o];
                }
                break;
            case models_1.AccountType.LISTENER:
                if (participant?.local) {
                    options.push({
                        text: participant?.user_name.includes('✋')
                            ? 'Lower hand'
                            : 'Raise hand ✋',
                        action: participant?.user_name.includes('✋')
                            ? () => lowerHand(participant)
                            : () => raiseHand(participant),
                    });
                }
                else {
                    const o = [
                        {
                            text: 'Make moderator',
                            action: () => changeAccountType(participant, models_1.AccountType.MODERATOR),
                        },
                        {
                            text: 'Make speaker',
                            action: () => changeAccountType(participant, models_1.AccountType.SPEAKER),
                        },
                        {
                            text: 'Remove from call',
                            action: () => removeFromCall(participant),
                            warning: true,
                        },
                    ];
                    options = [...options, ...o];
                }
                break;
            default:
                break;
        }
        /**
         * Let the local participant leave. (There's also
         * a button in the tray.) "Leave" or "Remove" should
         * be the last items
         */
        if (participant?.local) {
            const lastMod = modCount < 2 && getAccountType(participant?.user_name) === models_1.AccountType.MODERATOR;
            options.push({
                text: lastMod ? 'End call' : 'Leave call',
                action: () => (lastMod ? endCall() : leaveCall()),
                warning: true,
            });
        }
        return options;
    }, [
        participant,
        local,
        getAccountType,
        changeAccountType,
        handleMute,
        handleUnmute,
        removeFromCall,
        endCall,
        lowerHand,
        leaveCall,
        modCount,
        raiseHand,
    ]);
    const showMoreMenu = (0, react_1.useMemo)(() => {
        return getAccountType(local?.user_name) === models_1.AccountType.MODERATOR || participant?.local;
    }, [getAccountType, local, participant]);
    const audioTrack = (0, react_1.useMemo)(() => participant?.tracks?.audio?.state === 'playable'
        ? participant?.tracks?.audio?.track
        : null, [participant?.tracks?.audio?.state]);
    return (react_1.default.createElement(react_native_1.View, { style: [
            styles.container,
            { zIndex, elevation: react_native_1.Platform.OS === 'android' ? zIndex : 0 },
        ] },
        react_1.default.createElement(react_native_1.View, { style: [
                styles.avatar,
                activeSpeakerId === participant?.user_id && styles.isActive,
                !participant?.audio && styles.isMuted,
            ] },
            react_1.default.createElement(react_native_1.Text, { style: styles.initials, numberOfLines: 1 },
                participant?.owner ? ADMIN_BADGE : '',
                initials(participant?.user_name))),
        getAccountType(participant?.user_name) !== models_1.AccountType.LISTENER && (react_1.default.createElement(react_native_1.View, { style: styles.audioIcon }, participant?.audio ? (react_1.default.createElement(react_native_1.Image, { source: require('../icons/mic.png') })) : (react_1.default.createElement(react_native_1.Image, { source: require('../icons/muted.png') })))),
        react_1.default.createElement(react_native_1.Text, { style: styles.name, numberOfLines: 1 }, name),
        showMoreMenu && menuOptions.length > 0 && (react_1.default.createElement(react_native_1.View, { style: styles.menu },
            react_1.default.createElement(Menu_1.default, { options: menuOptions }))),
        audioTrack && (react_1.default.createElement(react_native_daily_js_1.DailyMediaView, { id: `audio-${participant.user_id}`, videoTrack: null, audioTrack: audioTrack }))));
};
const styles = react_native_1.StyleSheet.create({
    container: {
        margin: 8,
        position: 'relative',
        maxWidth: 104,
    },
    avatar: {
        width: AVATAR_DIMENSION,
        height: AVATAR_DIMENSION,
        borderRadius: 24,
        backgroundColor: theme_1.default.colors.turquoise,
        borderWidth: 2,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: theme_1.default.fontSize.xlarge,
        color: theme_1.default.colors.blueLight,
        fontWeight: '600',
        lineHeight: 32,
    },
    isActive: {
        borderColor: theme_1.default.colors.teal,
    },
    isMuted: {
        backgroundColor: theme_1.default.colors.grey,
    },
    name: {
        color: theme_1.default.colors.blueDark,
        fontWeight: '400',
        fontSize: theme_1.default.fontSize.large,
        overflow: 'hidden',
        marginTop: 8,
    },
    audioIcon: {
        position: 'absolute',
        top: AVATAR_DIMENSION - 28,
        left: -4,
    },
    showMore: {
        backgroundColor: theme_1.default.colors.white,
        padding: 4,
        borderRadius: 24,
        position: 'absolute',
        top: -50,
        right: -6,
    },
    menu: {
        position: 'absolute',
        top: AVATAR_DIMENSION - 28,
        right: -4,
        zIndex: 15,
        backgroundColor: theme_1.default.colors.white,
        padding: 4,
        borderRadius: 16,
        elevation: 3,
        shadowColor: theme_1.default.colors.blue,
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        },
    },
});
exports.default = Participant;
//# sourceMappingURL=Participant.js.map