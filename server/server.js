"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("./models/models"));
const services_1 = __importDefault(require("./services/services"));
const routes_1 = __importDefault(require("./routes/routes"));
const config_1 = __importDefault(require("./config/config"));
const server = {
    models: models_1.default,
    services: services_1.default,
    routes: routes_1.default,
    config: config_1.default
};
exports.default = server;
