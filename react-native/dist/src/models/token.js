"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    exp;
    token;
    room_name;
    user_name;
    is_owner;
    enable_recording;
    start_video_off;
    static fromJSON(obj) {
        let item = Object.assign(new Token(), obj);
        return item;
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map