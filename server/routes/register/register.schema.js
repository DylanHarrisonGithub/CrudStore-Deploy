"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    email: {
        type: 'string',
        isEmail: true,
        required: true
    },
    password: {
        minLength: 8,
        type: 'string',
        isPassword: true,
        required: true
    }
};
