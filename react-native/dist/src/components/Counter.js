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
const theme_1 = __importDefault(require("../styles/theme"));
const Counter = () => {
    const { roomExp, leaveCall, view } = (0, CallProvider_1.useCallState)();
    const [counter, setCounter] = (0, react_1.useState)('');
    let interval;
    (0, react_1.useEffect)(() => {
        /**
         * Rooms exist for 10 minutes from creation.
         * We use the expiry timestamp to show participants
         * how long they have left in the room.
         */
        clearInterval(interval);
        interval = setInterval(() => {
            let secs = Math.round((roomExp - Date.now()) / 1000);
            const value = Math.floor(secs / 60) + ':' + ('0' + (secs % 60)).slice(-2);
            if (secs <= 0) {
                clearInterval(interval);
                console.log('Eep! Room has expired');
                leaveCall();
                return;
            }
            setCounter(value);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [roomExp, view]);
    return (react_1.default.createElement(react_native_1.Text, { style: styles.container },
        "Room ends in ",
        react_1.default.createElement(react_native_1.Text, { style: styles.counter }, counter)));
};
const styles = react_native_1.StyleSheet.create({
    container: {
        fontSize: theme_1.default.fontSize.base,
        color: theme_1.default.colors.greyDark,
    },
    counter: {
        width: 28,
        textAlign: 'right',
    },
});
exports.default = Counter;
//# sourceMappingURL=Counter.js.map