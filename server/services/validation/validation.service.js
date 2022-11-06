"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// below is a useful example of how to require at least one of a list of keys to be present
// type Fruit = "apple" | 'banana' | 'coconut'
// type RequireOne<T> = T & { [P in keyof T]: Required<Pick<T, P>> }[keyof T]
// type FruitCollection = RequireOne<{ [f in Fruit]?: number }>
const regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    alpha: /^[a-zA-Z]*$/,
    numeric: /^[0-9]*$/,
    alphaNumeric: /^[a-zA-Z0-9]*$/,
    alphaNumericSpaces: /^[a-zA-Z0-9 ]*$/,
    commonWriting: /^[A-Za-z0-9 \-_.,?!()"'/$&]*$/,
    password: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])/
};
const validation = (input, schema) => {
    let _validateLeafNode = (key, input, schema) => {
        let errors = [];
        if (schema.hasOwnProperty('minLength')) {
            if (input.length < schema['minLength']) {
                errors.push({ key: key, message: key + ' must be at least ' + schema['minLength'] + ' characters long.' });
            }
        }
        if (schema.hasOwnProperty('maxLength')) {
            if (input.length > schema['maxLength']) {
                errors.push({ key: key, message: key + ' cannot exceed ' + schema['maxLength'] + ' characters.' });
            }
        }
        if (schema.hasOwnProperty('isAlpha') && schema['isAlpha']) {
            if (!regex.alpha.test(input)) {
                errors.push({ key: key, message: key + ' can only contain letters.' });
            }
        }
        if (schema.hasOwnProperty('isAlphaNumeric') && schema['isAlphaNumeric']) {
            if (!regex.alphaNumeric.test(input)) {
                errors.push({ key: key, message: key + ' can only contain letters and numbers.' });
            }
        }
        if (schema.hasOwnProperty('isAlphaNumericSpaces') && schema['isAlphaNumericSpaces']) {
            if (!regex.alphaNumericSpaces.test(input)) {
                errors.push({ key: key, message: key + ' can only contain letters, numbers and spaces.' });
            }
        }
        if (schema.hasOwnProperty('isCommonWriting') && schema['isCommonWriting']) {
            if (!regex.commonWriting.test(input)) {
                errors.push({ key: key, message: key + ' can only contain letters, numbers, spaces and punctuation.' });
            }
        }
        if (schema.hasOwnProperty('isEmail') && schema['isEmail']) {
            if (!regex.email.test(input)) {
                errors.push({ key: key, message: key + ' must be a valid email.' });
            }
        }
        if (schema.hasOwnProperty('isPassword') && schema['isPassword']) {
            if (!regex.password.test(input)) {
                errors.push({ key: key, message: key + ' must contain at least one lowercase and uppercase letter, number, and special character.' });
            }
        }
        if (schema.hasOwnProperty('regex')) {
            if (!schema['regex'].test(input)) {
                errors.push({ key: key, message: key + ' does not match format.' });
            }
        }
        if (schema.hasOwnProperty('min')) {
            if (input < schema['min']) {
                errors.push({ key: key, message: key + ' must be at least ' + schema['min'] + '.' });
            }
        }
        if (schema.hasOwnProperty('max')) {
            if (input > schema['max']) {
                errors.push({ key: key, message: key + ' cannot exceed ' + schema['max'] + '.' });
            }
        }
        return errors;
    };
    let _validate = (input, schema, validate, validateLeafNode) => {
        let errors = [];
        for (let key in schema) {
            if (input.hasOwnProperty(key) && !(input[key] === undefined || input[key] === null)) {
                if (typeof schema[key]['type'] === 'object') {
                    if (Array.isArray(input[key])) {
                        for (let item of input[key]) {
                            errors = errors.concat(validate(item, schema[key]['type'], validate, validateLeafNode));
                        }
                    }
                    else {
                        errors = errors.concat(validate(input[key], schema[key]['type'], validate, validateLeafNode));
                    }
                }
                else {
                    if (schema[key]['type'] === (typeof input[key])) {
                        if (['number', 'string', 'boolean'].indexOf(typeof input[key]) > -1) {
                            errors = errors.concat(validateLeafNode(key, input[key], schema[key]));
                        }
                        else {
                            errors.push({
                                key: key,
                                message: key + ' is not of a supported type'
                            });
                        }
                    }
                    else {
                        if (Array.isArray(input[key])) {
                            for (let item of input[key]) {
                                errors = errors.concat(validateLeafNode(key, item, schema[key]));
                            }
                        }
                        else {
                            errors.push({
                                key: key,
                                message: key + ' does not match specified type.'
                            });
                        }
                    }
                }
            }
            else {
                if (schema[key].hasOwnProperty('required') && schema[key]['required']) {
                    errors.push({
                        key: key,
                        message: key + ' is required.'
                    });
                }
            }
        }
        return errors;
    };
    return _validate(input, schema, _validate, _validateLeafNode);
};
exports.default = validation;
