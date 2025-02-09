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
import { is, sql } from 'drizzle-orm';


const withdrawals = pgTable('withdrawals', {
    id: uuid('id').primaryKey().defaultRandom(),
    transactionId: uuid('transaction_id').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    status: varchar('status').notNull(),
    requestedAt: timestamp('requested_at').defaultNow().notNull(),
    processedAt: timestamp('processed_at'),
});


export default withdrawals;