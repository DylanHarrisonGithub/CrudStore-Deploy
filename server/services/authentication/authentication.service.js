"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const server_1 = __importDefault(require("../../server"));
const authentication = {
    generateToken: (data) => jsonwebtoken_1.default.sign(data, server_1.default.config.SERVER_SECRET),
    verifyToken: (token) => {
        try {
            let decoded = jsonwebtoken_1.default.verify(token, server_1.default.config.SERVER_SECRET);
        }
        catch (_a) {
            return false;
        }
        return true;
    },
    decodeToken: (token) => {
        try {
            let decoded = jsonwebtoken_1.default.verify(token, server_1.default.config.SERVER_SECRET);
            return decoded;
        }
        catch (_a) {
            return null;
        }
    },
    generateTimeToken: (data) => {
        let now = Math.floor(Date.now() / 60000);
        now = now - (now % 10);
        let payload = now.toString() + server_1.default.config.SERVER_SECRET;
        if (data) {
            payload = JSON.stringify(data) + payload;
        }
        return crypto_1.default.createHash('md5').update(payload).digest('hex').substring(0, 6);
    },
    verifyTimeToken: (data, token, ttlMinutes) => {
        let ttl = 10;
        let now = Math.floor(Date.now() / 60000);
        now = now - (now % 10);
        let payload = now.toString() + server_1.default.config.SERVER_SECRET;
        if (data) {
            payload = JSON.stringify(data) + payload;
        }
        if (ttlMinutes && ttlMinutes > 10) {
            ttl = ttlMinutes;
        }
        let verified = false;
        let nowhash = "";
        while (ttl > 0) {
            nowhash = crypto_1.default.createHash('md5').update(payload).digest('hex').substring(0, 6);
            if (nowhash === token) {
                verified = true;
            }
            ttl -= 10;
            now -= 10;
        }
        return verified;
    }
};
exports.default = authentication;
