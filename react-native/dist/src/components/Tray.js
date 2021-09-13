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
const react_native_1 = require("react-native");
const react_native_2 = require("react-native");
const react_native_3 = require("react-native");
const CallProvider_1 = require("../contexts/CallProvider");
const models_1 = require("../models");
const theme_1 = __importDefault(require("../styles/theme"));
const Tray = () => {
    const { getAccountType, leaveCall, handleMute, handleUnmute, participants, endCall, lowerHand, raiseHand, } = (0, CallProvider_1.useCallState)();
    const local = (0, react_1.useMemo)(() => participants?.filter((p) => p?.local)[0], [
        participants,
    ]);
    const handleAudioChange = (0, react_1.useCallback)(() => {
        return local?.audio ? handleMute(local) : handleUnmute(local);
    }, [handleMute, handleUnmute, local]);
    const mods = (0, react_1.useMemo)(() => participants?.filter((p) => p?.owner), [
        participants,
        getAccountType,
    ]);
    const pressedStyle = ({ pressed }) => [
        {
            borderColor: pressed ? theme_1.default.colors.greyLightest : theme_1.default.colors.grey,
            borderWidth: 2,
        },
        styles.button,
    ];
    const handleHandRaising = (0, react_1.useCallback)(() => local?.user_name.includes('✋') ? lowerHand(local) : raiseHand(local), [lowerHand, raiseHand, local]);
    const accountType = getAccountType(local?.user_name);
    return (react_1.default.createElement(react_native_3.View, { style: styles.tray },
        accountType == models_1.AccountType.SPEAKER || accountType == models_1.AccountType.MODERATOR ? (react_1.default.createElement(react_native_3.Pressable, { onPress: handleAudioChange, style: pressedStyle },
            react_1.default.createElement(react_native_3.View, { style: styles.textContainer },
                local?.audio ? (react_1.default.createElement(react_native_3.Image, { source: require('../icons/simple_mic.png') })) : (react_1.default.createElement(react_native_3.Image, { source: require('../icons/simple_muted.png') })),
                react_1.default.createElement(react_native_3.Text, { style: styles.buttonText }, local?.audio ? 'Mute' : 'Unmute')))) : (react_1.default.createElement(react_native_3.Pressable, { onPress: handleHandRaising },
            react_1.default.createElement(react_native_3.View, { style: styles.textContainer },
                react_1.default.createElement(react_native_3.Text, { style: [styles.buttonText, { paddingTop: 4 }] }, local?.user_name.includes('✋') ? 'Lower hand' : 'Raise hand ✋')))),
        mods?.length < 2 && getAccountType(local?.user_name) === models_1.AccountType.MODERATOR ? (react_1.default.createElement(react_native_3.Pressable, { onPress: endCall, style: pressedStyle },
            react_1.default.createElement(react_native_3.Text, { style: styles.leaveText }, "End call"))) : (react_1.default.createElement(react_native_3.Pressable, { onPress: leaveCall, style: pressedStyle },
            react_1.default.createElement(react_native_3.Text, { style: styles.leaveText }, "Leave call")))));
};
const height = react_native_1.Dimensions.get('window').height;
const trayHeight = react_native_2.Platform.OS === 'ios' ? 60 : 100;
const styles = react_native_3.StyleSheet.create({
    tray: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'absolute',
        height: trayHeight,
        top: height - trayHeight,
        width: '100%',
        backgroundColor: theme_1.default.colors.grey,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    button: {
        paddingVertical: 4,
        borderRadius: 8,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 4,
        color: theme_1.default.colors.blueDark,
        fontSize: theme_1.default.fontSize.xlarge,
        fontWeight: '600',
    },
    leaveText: {
        color: theme_1.default.colors.blueDark,
        fontSize: theme_1.default.fontSize.xlarge,
        fontWeight: '600',
    },
});
exports.default = Tray;
//# sourceMappingURL=Tray.js.map