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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const server_1 = __importDefault(require("./server/server"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', (request, response) => {
    let pRequest = server_1.default.services.requestParser(request);
    console.log(pRequest);
    let res = server_1.default.services.router(server_1.default.services.requestParser(request));
    console.log(res);
    Object.keys(res.headers || {}).forEach(key => response.setHeader(key, res.headers[key]));
    if (res.json) {
        response.status(res.code).json(res.json);
    }
    else if (res.html) {
        response.status(res.code).send(res.html);
    }
    else if (res.filename) {
        response.status(res.code).sendFile(res.filename);
    }
    else if (res.redirect) {
        response.redirect(res.redirect);
    }
    else {
        response.sendStatus(res.code);
    }
});
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, 'client')));
app.listen(process.env.PORT || 3000, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`CrudStore listening on port ${process.env.PORT || 3000}`);
}));
