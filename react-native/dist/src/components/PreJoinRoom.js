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
const CallProvider_1 = require("../contexts/CallProvider");
const models_1 = require("../models");
const theme_1 = __importDefault(require("../styles/theme"));
const PreJoinRoom = ({ handleLinkPress }) => {
    const { joinRoom, error } = (0, CallProvider_1.useCallState)();
    const [firstName, setFirstName] = (0, react_1.useState)('');
    const [lastName, setLastName] = (0, react_1.useState)('');
    const [roomName, setRoomName] = (0, react_1.useState)('');
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const [required, setRequired] = (0, react_1.useState)(false);
    const submitForm = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        if (!firstName?.trim()) {
            setRequired(true);
            return;
        }
        if (submitting)
            return;
        setSubmitting(true);
        setRequired(false);
        let username = firstName?.trim() + (lastName?.trim() ? ` ${lastName?.trim()}` : '');
        let name = '';
        if (roomName?.trim()?.length) {
            name = username;
            /**
             * We track the account type but appending it to the username.
             * This is a quick solution for now not a production-worthy solution!
             */
            username = `${username}_${models_1.AccountType.LISTENER}`;
        }
        else {
            username = `${username}_${models_1.AccountType.MODERATOR}`;
        }
        joinRoom({ username, name });
    }, [firstName, lastName, roomName, joinRoom]);
    (0, react_1.useEffect)(() => {
        if (error) {
            setSubmitting(false);
        }
    }, [error]);
    return (react_1.default.createElement(react_native_2.View, { style: styles.container },
        react_1.default.createElement(react_native_1.KeyboardAvoidingView, { contentContainerStyle: { flex: 1 }, behavior: react_native_1.Platform.OS === 'ios' ? 'padding' : 'height', style: styles.content },
            react_1.default.createElement(react_native_2.Text, { style: styles.header }, "Getting started"),
            react_1.default.createElement(react_native_2.Text, { style: styles.label }, "First name"),
            react_1.default.createElement(react_native_2.TextInput, { style: [
                    styles.input,
                    required && { borderColor: theme_1.default.colors.red, borderWidth: 1 },
                ], onChangeText: (text) => setFirstName(text) }),
            react_1.default.createElement(react_native_2.Text, { style: styles.label }, "Last name"),
            react_1.default.createElement(react_native_2.TextInput, { style: styles.input, onChangeText: (text) => setLastName(text) }),
            react_1.default.createElement(react_native_2.Text, { style: styles.label }, "Join code"),
            react_1.default.createElement(react_native_2.TextInput, { style: styles.input, onChangeText: (text) => setRoomName(text) }),
            react_1.default.createElement(react_native_2.Text, { style: styles.smallText }, "Enter code to join an existing room, or leave empty to create a new room."),
            react_1.default.createElement(react_native_2.Pressable, { onPress: submitForm, style: ({ pressed }) => [
                    {
                        backgroundColor: pressed
                            ? theme_1.default.colors.cyan
                            : theme_1.default.colors.turquoise,
                    },
                    styles.buttonContainer,
                ] },
                react_1.default.createElement(react_native_2.Text, { style: styles.submitButtonText }, submitting
                    ? 'Joining...'
                    : roomName?.trim()
                        ? 'Join room'
                        : 'Create and join room')),
            error && (react_1.default.createElement(react_native_2.Text, { style: styles.errorText },
                "Error: ",
                error.toString()))),
        react_1.default.createElement(react_native_2.Pressable, { onPress: handleLinkPress },
            react_1.default.createElement(react_native_2.Text, { style: styles.link }, "Learn more"))));
};
const styles = react_native_2.StyleSheet.create({
    container: {
        padding: 24,
    },
    content: {},
    header: {
        fontSize: theme_1.default.fontSize.xlarge,
        color: theme_1.default.colors.blueDark,
        fontWeight: '600',
        marginBottom: 12,
    },
    label: {
        color: theme_1.default.colors.blueDark,
        fontSize: theme_1.default.fontSize.large,
        marginBottom: 4,
        lineHeight: 16,
        marginTop: 16,
        fontWeight: '400',
    },
    input: {
        borderRadius: 8,
        borderColor: theme_1.default.colors.grey,
        borderWidth: 1,
        padding: 4,
        fontSize: theme_1.default.fontSize.xlarge,
        lineHeight: 24,
        marginBottom: 4,
        backgroundColor: theme_1.default.colors.white,
    },
    smallText: {
        fontSize: theme_1.default.fontSize.large,
        color: theme_1.default.colors.greyDark,
        fontWeight: '400',
        marginTop: 8,
        marginBottom: 24,
        marginHorizontal: 0,
    },
    buttonContainer: {
        overflow: 'hidden',
        marginBottom: 8,
        borderColor: theme_1.default.colors.cyanLight,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
    },
    submitButtonText: {
        fontSize: theme_1.default.fontSize.large,
        fontWeight: '600',
        textAlign: 'center',
    },
    errorText: {
        color: theme_1.default.colors.red,
        fontSize: theme_1.default.fontSize.large,
        marginBottom: 4,
    },
    link: {
        fontWeight: '400',
        fontSize: theme_1.default.fontSize.med,
        color: theme_1.default.colors.greyDark,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 16,
    },
});
exports.default = PreJoinRoom;
//# sourceMappingURL=PreJoinRoom.js.map