"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config = {
    SERVER_SECRET: process.env.SERVER_SECRET || '',
    DATABASE_URL: process.env.DATABASE_URL || '',
    APPNAME: 'CrudStore',
    ENVIRONMENT: 'DEVELOPMENT',
    SOCKET_CONNECT_PRIVELEGE: ['guest', 'user', 'admin'],
    ROOT_DIR: path_1.default.normalize(__dirname + `/../../`),
    PORT: process.env.PORT || 3000,
    ROOT_URL: '/',
    ERROR_URL: '/error'
};
exports.default = config;
