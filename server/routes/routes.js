"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_route_1 = __importDefault(require("./login/login.route"));
const login_schema_1 = __importDefault(require("./login/login.schema"));
const register_route_1 = __importDefault(require("./register/register.route"));
const register_schema_1 = __importDefault(require("./register/register.schema"));
const routes = {
    login: {
        method: ["POST"],
        contentType: "application/json",
        privelege: ['guest'],
        schema: login_schema_1.default,
        route: login_route_1.default
    },
    register: {
        method: ["POST"],
        contentType: "application/json",
        privelege: ['guest'],
        schema: register_schema_1.default,
        route: register_route_1.default
    },
};
exports.default = routes;
