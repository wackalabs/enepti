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
const clipboard_1 = __importDefault(require("@react-native-clipboard/clipboard"));
const theme_1 = __importDefault(require("../styles/theme"));
const CopyLinkBox = ({ room }) => {
    const [linkCopied, setLinkCopied] = (0, react_1.useState)(false);
    const copyToClipboard = () => {
        clipboard_1.default.setString(room?.name);
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 5000);
    };
    return (react_1.default.createElement(react_native_1.View, { style: styles.container },
        react_1.default.createElement(react_native_1.View, { style: styles.inviteContainer },
            react_1.default.createElement(react_native_1.Text, { style: styles.header }, "Invite others"),
            react_1.default.createElement(react_native_1.Text, { style: styles.subheader },
                "Copy and share join code with others to invite them. Code:",
                ' ',
                react_1.default.createElement(react_native_1.Text, { style: styles.bold }, room?.name)),
            react_1.default.createElement(react_native_1.Pressable, { onPress: copyToClipboard, style: ({ pressed }) => [
                    {
                        backgroundColor: pressed
                            ? theme_1.default.colors.cyan
                            : theme_1.default.colors.turquoise,
                    },
                    styles.buttonContainer,
                ] },
                react_1.default.createElement(react_native_1.Text, { style: styles.buttonText }, linkCopied ? 'Copied!' : `Copy join code`)))));
};
const styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 24,
        maxWidth: 330,
        marginLeft: 'auto',
        marginRight: 'auto',
        zIndex: 30,
        elevation: react_native_1.Platform.OS === 'android' ? 30 : 0
    },
    inviteContainer: {
        borderWidth: 1,
        borderColor: theme_1.default.colors.grey,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        color: theme_1.default.colors.blueDark,
        marginBottom: 8,
        fontSize: theme_1.default.fontSize.large,
        fontWeight: '600',
    },
    subheader: {
        textAlign: 'center',
        fontSize: theme_1.default.fontSize.med,
        color: theme_1.default.colors.blueDark,
    },
    bold: {
        fontWeight: '600',
    },
    buttonContainer: {
        overflow: 'hidden',
        marginBottom: 8,
        borderColor: theme_1.default.colors.cyanLight,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 16,
    },
    buttonText: {
        fontSize: theme_1.default.fontSize.med,
        fontWeight: '600',
        textAlign: 'center',
    },
});
exports.default = CopyLinkBox;
//# sourceMappingURL=CopyLinkBox.js.map