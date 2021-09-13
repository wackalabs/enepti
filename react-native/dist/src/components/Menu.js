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
const react_native_material_menu_1 = __importStar(require("react-native-material-menu"));
const theme_1 = __importDefault(require("../styles/theme"));
const ActionMenu = ({ options }) => {
    const menuRef = (0, react_1.useRef)(null);
    const hideMenu = () => {
        if (!menuRef?.current)
            return;
        menuRef?.current.hide();
    };
    const showMenu = () => {
        if (!menuRef?.current)
            return;
        menuRef?.current.show();
    };
    return (react_1.default.createElement(react_native_material_menu_1.default, { ref: menuRef, button: react_1.default.createElement(react_native_1.Pressable, { onPress: showMenu },
            react_1.default.createElement(react_native_1.Image, { source: require('../icons/more.png') })), animationDuration: 0 }, options.map((o, i) => (react_1.default.createElement(react_native_material_menu_1.MenuItem, { key: i, onPress: () => {
            o.action();
            hideMenu();
        } },
        react_1.default.createElement(react_native_1.Text, { style: [styles.text, o.warning && { color: theme_1.default.colors.redDark }] }, o.text))))));
};
const styles = react_native_1.StyleSheet.create({
    text: {
        fontSize: theme_1.default.fontSize.large,
        color: theme_1.default.colors.blueDark,
        paddingVertical: 6,
        paddingHorizontal: 16,
        flexWrap: 'nowrap',
    },
});
exports.default = ActionMenu;
//# sourceMappingURL=Menu.js.map