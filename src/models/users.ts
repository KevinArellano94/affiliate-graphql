import {
    pgTable,
    text,
    timestamp,
    uuid,
    boolean,
    jsonb,
    decimal,
    varchar,
    index,
    unique,
    foreignKey
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';


const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    contactInfo: jsonb('contact_info').notNull().default({}),
    taxInfo: jsonb('tax_info').notNull().default({}),
    bankingInfo: jsonb('banking_info').notNull().default({}),
    twoFactorSettings: jsonb('two_factor_settings').notNull().default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    isActive: boolean('is_active').default(true).notNull()
});


export default users;