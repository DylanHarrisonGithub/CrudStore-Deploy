"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
const authentication_service_1 = __importDefault(require("../../services/authentication/authentication.service"));
const crypto_1 = __importDefault(require("crypto"));
exports.default = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.params;
    const salt = crypto_1.default.randomBytes(32).toString('hex');
    const hash = yield crypto_1.default.pbkdf2Sync(password, salt, 32, 64, 'sha512').toString('hex');
    const res = yield db_service_1.default.row.create('user', { email: email, privilege: 'user', password: hash, salt: salt, avatar: `https://avatars.dicebear.com/api/male/john.svg?background=%230000ff` });
    if (res.success) {
        return new Promise(resolve => resolve({
            code: 200,
            json: {
                success: true,
                message: [`New user ${email} registered.`].concat(res.message),
                body: { token: authentication_service_1.default.generateToken({ email: email, privilege: 'user', dummy: "" }) }
            }
        }));
    }
    else {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                message: [`User ${email} could not be registered.`].concat(res.message),
                body: { res: res } //authentication.generateToken({email: email, privilege: 'user'}) }
            }
        }));
    }
});
