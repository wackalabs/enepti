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
const CallProvider_1 = require("../contexts/CallProvider");
const Participant_1 = __importDefault(require("./Participant"));
const CopyLinkBox_1 = __importDefault(require("./CopyLinkBox"));
const Counter_1 = __importDefault(require("./Counter"));
const theme_1 = __importDefault(require("../styles/theme"));
const models_1 = require("../models");
const CallContext_1 = require("../contexts/CallContext");
const InCall = ({ handleLinkPress }) => {
    const { participants, room, view, getAccountType } = (0, CallProvider_1.useCallState)();
    console.log(participants);
    const mods = (0, react_1.useMemo)(() => participants?.filter((p) => p?.owner), [participants, getAccountType]);
    const speakers = (0, react_1.useMemo)(() => participants?.filter((p) => getAccountType(p?.user_name) === models_1.AccountType.SPEAKER), [participants, getAccountType]);
    const local = (0, react_1.useMemo)(() => participants?.filter((p) => p?.local)[0], [participants]);
    const listeners = (0, react_1.useMemo)(() => {
        const l = participants
            ?.filter((p) => getAccountType(p?.user_name) === models_1.AccountType.LISTENER)
            .sort((a, _) => {
            // Move raised hands to front of list
            if (a?.user_name.includes('✋'))
                return -1;
            return 0;
        });
        return (react_1.default.createElement(react_native_1.View, { style: styles.listenersContainer }, l?.map((p, i) => (react_1.default.createElement(Participant_1.default, { participant: p, key: p.user_id, local: local, zIndex: l.length - i })))));
    }, [participants, getAccountType]);
    const canSpeak = (0, react_1.useMemo)(() => {
        const s = [...mods, ...speakers];
        return (react_1.default.createElement(react_native_1.View, { style: styles.speakersContainer }, s?.map((p, i) => (react_1.default.createElement(Participant_1.default, { participant: p, key: p.user_id, local: local })))));
    }, [mods, speakers]);
    return (react_1.default.createElement(react_native_1.View, { style: Object.assign({}, styles.container, { visibility: view === CallContext_1.CallState.INCALL ? 'visible' : 'hidden' }) },
        react_1.default.createElement(react_native_1.View, { style: styles.content },
            react_1.default.createElement(react_native_1.View, { style: styles.header },
                react_1.default.createElement(react_native_1.Text, { style: styles.headerText }, "Speakers"),
                react_1.default.createElement(Counter_1.default, null)),
            canSpeak,
            react_1.default.createElement(react_native_1.Text, { style: styles.headerText }, "Listeners"),
            listeners),
        react_1.default.createElement(CopyLinkBox_1.default, { room: room }),
        react_1.default.createElement(react_native_1.Pressable, { onPress: handleLinkPress },
            react_1.default.createElement(react_native_1.Text, { style: styles.link }, "Learn more"))));
};
const styles = react_native_1.StyleSheet.create({
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
        borderBottomColor: theme_1.default.colors.grey,
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
        color: theme_1.default.colors.greyDark,
        fontSize: theme_1.default.fontSize.xlarge,
    },
    link: {
        fontWeight: '400',
        fontSize: theme_1.default.fontSize.med,
        color: theme_1.default.colors.greyDark,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
exports.default = InCall;
//# sourceMappingURL=InCall.js.map