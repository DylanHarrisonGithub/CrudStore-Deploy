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
    row: {
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
    },
    table: {
        create: (table, columns) => __awaiter(void 0, void 0, void 0, function* () {
            const client = new pg_1.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
            const query = `CREATE TABLE IF NOT EXISTS "${table}" (${Object.keys(columns).map((key, index) => `\n  ${key} ${columns[key]}`) // (index !== Object.keys(columns).length -1 ? ',' : '')}`)
            }\n);`;
            console.log(query);
            try {
                yield client.connect();
                const result = yield client.query(query);
                yield client.end();
                console.log(result);
                return {
                    success: true,
                    query: query,
                    message: [`Table ${table} successfully created.`],
                };
            }
            catch (error) {
                yield client.end();
                return {
                    success: false,
                    query: query,
                    message: [`Error attempting to create table ${table}.`].concat(error.stack)
                };
            }
        }),
        read: (table) => __awaiter(void 0, void 0, void 0, function* () {
            const client = new pg_1.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
            const query = table ?
                `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}';`
                :
                    `SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE AND table_schema = 'public';`;
            try {
                yield client.connect();
                const result = yield client.query(query);
                yield client.end();
                return {
                    success: true,
                    query: query,
                    message: [table ? `${table} read successfully.` : `Tables read successfully`],
                    result: result.rows
                };
            }
            catch (error) {
                yield client.end();
                return {
                    success: false,
                    query: query,
                    message: [table ? `Error attempting to read table ${table}.` : `Error attempting to read tables.`].concat(error.stack)
                };
            }
        }),
        update: (table, updates) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!(Object.keys(updates).length)) {
                return {
                    success: true,
                    query: '',
                    message: [`Warning attempting to update table ${table}. No updates were provided`]
                };
            }
            const client = new pg_1.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
            const query = `ALTER TABLE "${table}"${Object.keys(updates.add || {}).map((column, i) => `\n  ADD "${column}" ${updates.add[column]}`)} ${(_a = updates.drop) === null || _a === void 0 ? void 0 : _a.map((column, i) => `\n  ADD DROP COLUMN "${column}"`)} ${Object.keys(updates.redifine || {}).map((column, i) => `\n  ALTER COLUMN "${column}" TYPE ${updates.redifine[column]}`)} ${Object.keys(updates.rename || {}).map((column, i) => `\n  RENAME COLUMN "${column}" TO ${updates.redifine[column]}`)};`;
            try {
                yield client.connect();
                const result = yield client.query(query);
                yield client.end();
                console.log(result);
                return {
                    success: true,
                    query: query,
                    message: [`Table ${table} successfully updated.`],
                };
            }
            catch (error) {
                yield client.end();
                return {
                    success: false,
                    query: query,
                    message: [`Error attempting to update table ${table}.`].concat(error.stack)
                };
            }
        }),
        delete: (table) => __awaiter(void 0, void 0, void 0, function* () {
            const client = new pg_1.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
            const query = `DROP TABLE "${table}";`;
            try {
                yield client.connect();
                const result = yield client.query(query);
                yield client.end();
                console.log(result);
                return {
                    success: true,
                    query: query,
                    message: [`Table ${table} successfully deleted.`],
                };
            }
            catch (error) {
                yield client.end();
                return {
                    success: false,
                    query: query,
                    message: [`Error attempting to delete table ${table}.`].concat(error.stack)
                };
            }
        })
    }
};
exports.default = db;
