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
    const res = yield db_service_1.default.row.read('user', { email: email });
    if (!res.success) {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                message: [`Server or Database error attempting to login user ${email}.`].concat(res.message)
            }
        }));
    }
    if (!(res.result && res.result.length)) {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                message: [`User ${email} not found.`].concat(res.message)
            }
        }));
    }
    const salt = res.result[0].salt;
    const hash = yield crypto_1.default.pbkdf2Sync(password, salt, 32, 64, 'sha512').toString('hex');
    if (!(hash === res.result[0].password)) {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                message: [`Password did not match for user ${email}.`].concat(res.message)
            }
        }));
    }
    return new Promise(resolve => resolve({
        code: 200,
        json: {
            success: true,
            message: [`User ${email} successfully logged in.`],
            body: { token: authentication_service_1.default.generateToken({ email: email, privilege: res.result[0].privilege }) }
        }
    }));
});
