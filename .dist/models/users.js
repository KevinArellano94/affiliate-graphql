"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    hashedPassword: (0, pg_core_1.varchar)('hashed_password', { length: 255 }).notNull(),
    fullName: (0, pg_core_1.varchar)('full_name', { length: 255 }).notNull(),
    contactInfo: (0, pg_core_1.jsonb)('contact_info').notNull().default({}),
    taxInfo: (0, pg_core_1.jsonb)('tax_info').notNull().default({}),
    bankingInfo: (0, pg_core_1.jsonb)('banking_info').notNull().default({}),
    twoFactorSettings: (0, pg_core_1.jsonb)('two_factor_settings').notNull().default({}),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull()
});
exports.default = users;
