"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const InCall_1 = __importDefault(require("./InCall"));
const PreJoinRoom_1 = __importDefault(require("./PreJoinRoom"));
const Tray_1 = __importDefault(require("./Tray"));
const CallProvider_1 = require("../contexts/CallProvider");
const theme_1 = __importDefault(require("styles/theme"));
const CallContext_1 = require("../contexts/CallContext");
const AppContent = () => {
    const { view } = (0, CallProvider_1.useCallState)();
    const handleLinkPress = async () => {
        const url = 'https://enepti.com';
        const supported = await react_native_1.Linking.canOpenURL(url);
        if (supported) {
            await react_native_1.Linking.openURL(url);
        }
    };
    return (react_1.default.createElement(react_native_1.View, { style: styles.appContainer },
        react_1.default.createElement(react_native_1.ScrollView, null,
            react_1.default.createElement(react_native_1.StatusBar, { barStyle: "dark-content" }),
            react_1.default.createElement(react_native_1.View, { style: styles.wrapper },
                react_1.default.createElement(react_native_1.View, { style: styles.header },
                    react_1.default.createElement(react_native_1.View, { style: styles.headerTop },
                        react_1.default.createElement(react_native_1.Text, { style: styles.title }, "Enepti"),
                        react_1.default.createElement(react_native_1.Image, { source: require('../icons/logo-solid.png'), style: styles.logo, resizeMode: 'contain' })),
                    react_1.default.createElement(react_native_1.Text, { style: styles.smallText }, "Play & Earn Audio Social Network")),
                view === CallContext_1.CallState.PREJOIN && (react_1.default.createElement(PreJoinRoom_1.default, { handleLinkPress: handleLinkPress })),
                view === CallContext_1.CallState.INCALL && react_1.default.createElement(InCall_1.default, { handleLinkPress: handleLinkPress }))),
        view === CallContext_1.CallState.INCALL && react_1.default.createElement(Tray_1.default, null)));
};
function App() {
    return (react_1.default.createElement(CallProvider_1.CallProvider, null,
        react_1.default.createElement(AppContent, null)));
}
const styles = react_native_1.StyleSheet.create({
    appContainer: {
        backgroundColor: theme_1.default.colors.greyLightest,
        flex: 1,
    },
    wrapper: {
        paddingTop: 48,
        paddingBottom: 80,
        flex: 1,
        marginVertical: 0,
        marginHorizontal: 'auto',
    },
    header: {
        paddingHorizontal: 24,
    },
    headerTop: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    title: {
        fontSize: theme_1.default.fontSize.xxlarge,
        marginHorizontal: 0,
        color: theme_1.default.colors.blueDark,
        fontWeight: '600',
    },
    logo: {
        width: 36,
        height: 36
    },
    smallText: {
        fontSize: theme_1.default.fontSize.large,
        color: theme_1.default.colors.greyDark,
        fontWeight: '400',
        marginTop: 8,
        marginBottom: 24,
        marginHorizontal: 0,
    },
});
exports.default = App;
//# sourceMappingURL=App.js.map