"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const server_1 = __importDefault(require("../../server"));
const file = {
    exists: (filepath) => new Promise(r => fs.access(server_1.default.config.ROOT_DIR + filepath, fs.constants.F_OK, (e) => r(!e))),
    create: (filepath, content) => new Promise((res, rej) => {
        fs.writeFile(server_1.default.config.ROOT_DIR + filepath, content, (err) => {
            if (err) {
                rej(err);
            }
            else {
                res('File created.');
            }
        });
    }),
    read: (filepath) => new Promise((res, rej) => {
        fs.readFile(server_1.default.config.ROOT_DIR + filepath, "utf8", (err, file) => {
            if (err) {
                rej(err);
            }
            else {
                res(file);
            }
        });
    }),
    update: (filepath, content) => new Promise((res, rej) => {
        fs.appendFile(server_1.default.config.ROOT_DIR + filepath, content, (err) => {
            if (err) {
                rej(err);
            }
            else {
                res('File updated.');
            }
        });
    }),
    delete: (filepath) => new Promise((res, rej) => {
        fs.unlink(server_1.default.config.ROOT_DIR + filepath, (err) => {
            if (err) {
                rej(err);
            }
            else {
                res('File deleted.');
            }
        });
    }),
    move: (srcpath, destpath) => new Promise((res, rej) => {
        fs.rename(server_1.default.config.ROOT_DIR + srcpath, server_1.default.config.ROOT_DIR + destpath, (err) => {
            if (err) {
                rej(err);
            }
            else {
                res('File moved successfully.');
            }
        });
    }),
    readDirectory: (path) => {
        return new Promise((res, rej) => {
            fs.readdir(server_1.default.config.ROOT_DIR + path, (err, files) => {
                if (err) {
                    rej(err);
                }
                else {
                    res(files);
                }
            });
        });
    },
    createDirectory: (path) => {
        return new Promise((res, rej) => {
            fs.mkdir(server_1.default.config.ROOT_DIR + path, { recursive: true }, err => {
                if (err) {
                    rej(err);
                }
                else {
                    res('Directory created successfully.');
                }
            });
        });
    },
    deleteDirectory: (path) => {
        return new Promise((res, rej) => {
            fs.rmdir(server_1.default.config.ROOT_DIR + path, { recursive: true }, err => {
                if (err) {
                    rej(err);
                }
                else {
                    res('Directory deleted successfully.');
                }
            });
        });
    }
};
exports.default = file;
