"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const requestParser = (req) => {
    let token = null;
    if (req.cookies['token']) {
        token = req.cookies.token;
    }
    ;
    if (!token && req.headers['token']) {
        token = req.headers.token;
    }
    ;
    let route = "";
    if (req.url) {
        let parsed = url.parse(req.url).pathname;
        if (parsed) {
            route = parsed.split('/').join('-').substring(1);
            if (route.startsWith('api/')) {
                route = route.substring(4);
            }
        }
    }
    let ip = '';
    if (Array.isArray(req.headers['x-forwarded-for'])) {
        ip = (req.headers['x-forwarded-for'])[0];
    }
    else {
        ip = (req.headers['x-forwarded-for']);
    }
    if (req.socket.remoteAddress) {
        ip = ip || (req.socket.remoteAddress);
    }
    return {
        ip: ip,
        timestamp: Date.now(),
        method: req.method,
        accepts: req.get('Accept') || '',
        route: route,
        token: token,
        params: req.method === 'GET' ? req.query : req.body,
        files: req.files
    };
};
exports.default = requestParser;
