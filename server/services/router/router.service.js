"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.negotiateCompatibleResponseContentType = void 0;
const server_1 = __importDefault(require("../../server"));
const config_1 = __importDefault(require("../../../server/config/config"));
// pick preferred compatible response type
const negotiateCompatibleResponseContentType = (requestAccepts, routeContentType) => {
    var _a;
    // break down accepts string into [[type, subtype]]
    const reqTypes = requestAccepts.split(',').map(type => type.indexOf(';') > -1 ? type.substring(0, type.lastIndexOf(';')).toLowerCase().split('/') : type.toLowerCase().split('/'));
    const resTypes = routeContentType.split(',').map(type => type.indexOf(';') > -1 ? type.substring(0, type.lastIndexOf(';')).toLowerCase().split('/') : type.toLowerCase().split('/'));
    if (reqTypes.some(type => type[0] === '*')) {
        return resTypes[0].join('/');
    }
    if (resTypes.some(type => type[0] === '*')) {
        return reqTypes[0].join('/');
    } // should pretty much never happen
    let matches = resTypes.filter(resType => {
        if (reqTypes.some(reqType => resType[0] === reqType[0] &&
            (resType[1] === reqType[1] ||
                resType[1] === '*' || // should pretty much never happen
                reqType[1] === '*'))) {
            return true;
        }
    });
    matches = matches.map(resType => resType[1] !== '*' ? resType : reqTypes.find(reqType => resType[0] === reqType[0])); // but if resType[1] === '*', replace with specified reqType[1] 
    return ((_a = matches[0]) === null || _a === void 0 ? void 0 : _a.join('/')) || '';
};
exports.negotiateCompatibleResponseContentType = negotiateCompatibleResponseContentType;
const acceptsJSON = (accepts) => accepts.includes('application/json') || accepts.includes('*/*');
const acceptsHTML = (accepts) => accepts.includes('text/html') || accepts.includes('*/*');
const error = (request, response) => {
    if (acceptsJSON(request.accepts)) {
        return response;
    }
    else {
        return {
            code: 302,
            redirect: config_1.default.ERROR_URL + (new URLSearchParams(JSON.stringify(response)))
        };
    }
};
const router = (request) => {
    if (request.hasOwnProperty('route')) {
        let route = server_1.default.routes[request.route];
        if (route) {
            if (route.method.indexOf(request.method) > -1) {
                if (route.privelege.indexOf('guest') > -1) {
                    let validationErrors = server_1.default.services.validation(request.params, route.schema);
                    if (!validationErrors.length) {
                        const negotiated = (0, exports.negotiateCompatibleResponseContentType)(request.accepts, route.contentType);
                        if (negotiated) {
                            // route access granted for request!
                            request.accepts = negotiated;
                            return route.route(request);
                        }
                        else {
                            return error(request, {
                                code: 400,
                                json: {
                                    success: false,
                                    message: [
                                        `Could not negotiate response type.`,
                                        `Request accepts ${request.accepts}.`,
                                        `Route provides ${route.contentType}`
                                    ]
                                }
                            });
                        }
                    }
                    else {
                        return error(request, {
                            code: 400,
                            json: {
                                success: false,
                                message: ['Validation failed for route parameters.'].concat(validationErrors.map(err => `key: ${err.key}: ${err.message}`))
                            }
                        });
                    }
                }
                else {
                    if (request.token) {
                        let token = server_1.default.services.authentication.decodeToken(request.token);
                        if (token) {
                            if (token.hasOwnProperty('privelege') && route.privelege.indexOf(token.privelege) > -1) {
                                let validationErrors = server_1.default.services.validation(request.params, route.schema);
                                if (!validationErrors.length) {
                                    const negotiated = (0, exports.negotiateCompatibleResponseContentType)(request.accepts, route.contentType);
                                    if (negotiated) {
                                        // route access granted for request!
                                        request.accepts = negotiated;
                                        return route.route(request);
                                    }
                                    else {
                                        return error(request, {
                                            code: 400,
                                            json: {
                                                success: false,
                                                message: [
                                                    `Could not negotiate response type.`,
                                                    `Request accepts ${request.accepts}.`,
                                                    `Route provides ${route.contentType}`
                                                ]
                                            }
                                        });
                                    }
                                }
                                else {
                                    return error(request, {
                                        code: 400,
                                        json: {
                                            success: false,
                                            message: ['Validation failed for route parameters.'].concat(validationErrors.map(err => `key: ${err.key}: ${err.message}`))
                                        }
                                    });
                                }
                            }
                            else {
                                return error(request, {
                                    code: 403,
                                    json: {
                                        success: false,
                                        message: ['Provided authentication does not have privelege to access route.']
                                    }
                                });
                            }
                        }
                        else {
                            return error(request, {
                                code: 403,
                                json: {
                                    success: false,
                                    message: ['Provided authentication was not valid.']
                                }
                            });
                        }
                    }
                    else {
                        return error(request, {
                            code: 401,
                            json: {
                                success: false,
                                message: ['Authentication was not provided for protected route.']
                            }
                        });
                    }
                }
            }
            else {
                return error(request, {
                    code: 405,
                    json: {
                        success: false,
                        message: ['Method not allowed.', `Provided route, '${request.route}' is ${route.method} method.`]
                    }
                });
            }
        }
        else {
            return error(request, {
                code: 404,
                json: {
                    success: false,
                    message: [`Provided route, '${request.route}' does not exist.`]
                }
            });
        }
    }
    else {
        return error(request, {
            code: 400,
            json: {
                success: false,
                message: ['Route was not provided.']
            }
        });
    }
};
exports.default = router;
