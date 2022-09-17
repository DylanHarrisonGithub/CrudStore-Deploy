"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const pg_1 = __importDefault(require("pg"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, 'client')));
app.listen(process.env.PORT || 3000, () => {
    console.log(`CrudStore listening on port ${process.env.PORT || 3000}`);
    if (process.env.DATABASE_URL) {
        const pool = new pg_1.default.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        if (pool) {
            console.log(`Successfully connected to Postgres database.`);
        }
        else {
            console.log(`Could not connect to database. DATABASE_URL environtment variable may be set incorrectly.`);
        }
    }
    else {
        console.log(`Could not connect to database. DATABASE_URL environment variable not set.`);
    }
});
