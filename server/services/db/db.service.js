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
const pg_1 = __importDefault(require("pg"));
const quoteString = (val) => (typeof val === 'string') ? "'" + val + "'" : val;
const db = {
    create: (table, row) => __awaiter(void 0, void 0, void 0, function* () {
        const client = new pg_1.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
        const query = `INSERT INTO "${table}" (${Object.keys(row).map((key, index) => index !== Object.keys(row).length - 1 ? key + ', ' : key).join("")}) VALUES (${Object.keys(row).map((key, index) => index !== Object.keys(row).length - 1 ? quoteString(row[key]) + ', ' : quoteString(row[key])).join("")});`;
        try {
            yield client.connect();
            yield client.query(query);
            yield client.end();
            return {
                success: true,
                query: query,
                message: [`Row successfully inserted into table ${table}.`]
            };
        }
        catch (error) {
            yield client.end();
            return {
                success: false,
                query: query,
                message: [`Error attempting to insert row into table ${table}.`].concat(error.stack)
            };
        }
    }),
    read: (table, where) => __awaiter(void 0, void 0, void 0, function* () {
        const client = new pg_1.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
        const query = `SELECT * FROM "${table}"${(where && Object.keys(where).length) ?
            ` WHERE ` +
                Object.keys(where).map((key, index) => index !== Object.keys(where).length - 1 ?
                    key + ` = ` + quoteString(where[key]) + ` AND `
                    :
                        key + ` = ` + quoteString(where[key])).join("")
            : ``};`;
        try {
            yield client.connect();
            const result = yield client.query(query);
            yield client.end();
            return {
                success: true,
                query: query,
                message: [`Rows successfully selected from table ${table}.`],
                result: result.rows
            };
        }
        catch (error) {
            yield client.end();
            return {
                success: false,
                query: query,
                message: [`Error attempting to select from table ${table}.`].concat(error.stack)
            };
        }
    }),
    update: (table, columns, where) => __awaiter(void 0, void 0, void 0, function* () {
        const client = new pg_1.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
        const query = `UPDATE "${table}" SET ${Object.keys(columns).map((key, index) => index !== Object.keys(columns).length - 1 ?
            key + ` = ` + quoteString(columns[key]) + `, `
            :
                key + ` = ` + quoteString(columns[key])).join("")} ${(where && Object.keys(where).length) ?
            `WHERE ` +
                Object.keys(where).map((key, index) => index !== Object.keys(where).length - 1 ?
                    key + ` = ` + quoteString(where[key]) + ` AND `
                    :
                        key + ` = ` + quoteString(where[key])).join("")
            : ``};`;
        if (!(Object.keys(columns).length)) {
            return {
                success: false,
                query: query,
                message: [`No updates were provided for table ${table}.`]
            };
        }
        try {
            yield client.connect();
            yield client.query(query);
            return {
                success: true,
                query: query,
                message: [`Row(s) successfully updated in table ${table}.`]
            };
        }
        catch (error) {
            return {
                success: false,
                query: query,
                message: [`Error attempting to update row(s) in table ${table}.`].concat(error.stack)
            };
        }
        finally {
            yield client.end();
        }
    }),
    delete: (table, where) => __awaiter(void 0, void 0, void 0, function* () {
        const client = new pg_1.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
        const query = `DELETE FROM "${table}"${(where && Object.keys(where).length) ?
            ` WHERE ` +
                Object.keys(where).map((key, index) => index !== Object.keys(where).length - 1 ?
                    key + ` = ` + quoteString(where[key]) + ` AND `
                    :
                        key + ` = ` + quoteString(where[key])).join("")
            : ``};`;
        try {
            yield client.connect();
            yield client.query(query);
            return {
                success: true,
                query: query,
                message: [`Row(s) successfully deleted in table ${table}.`]
            };
        }
        catch (error) {
            return {
                success: false,
                query: query,
                message: [`Error attempting to delete row(s) in table ${table}.`].concat(error.stack)
            };
        }
        finally {
            yield client.end();
        }
    })
};
exports.default = db;
