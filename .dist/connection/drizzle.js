"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
function drizzleConnection() {
    const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
    const db = (0, neon_http_1.drizzle)({ client: sql });
    return db;
}
exports.default = drizzleConnection;
