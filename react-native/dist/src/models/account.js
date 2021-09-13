"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.AccountType = void 0;
var AccountType;
(function (AccountType) {
    AccountType["MODERATOR"] = "MOD";
    AccountType["SPEAKER"] = "SPK";
    AccountType["LISTENER"] = "LST";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
class Account {
    type;
}
exports.Account = Account;
//# sourceMappingURL=account.js.map