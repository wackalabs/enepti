"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    id;
    name;
    token;
    api_created;
    privacy;
    url;
    created_at;
    config;
    static fromJSON(obj) {
        let item = Object.assign(new Room(), obj);
        return item;
    }
}
exports.Room = Room;
//# sourceMappingURL=room.js.map