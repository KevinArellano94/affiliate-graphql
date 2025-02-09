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


const conversions = pgTable('conversions', {
    id: uuid('id').primaryKey().defaultRandom(),
    linkId: uuid('link_id').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    status: text('status').notNull(),

    /**
     * @description transaction_data can be one of the following:
     * - pending: transaction is still processing
     * - completed: transaction has been processed successfully
     * - failed: transaction processing failed
     * - refunded: transaction has been refunded
     */
    transactionData: jsonb('transaction_data').notNull().default({}),
    convertedAt: timestamp('converted_at').defaultNow().notNull(),
});


export default conversions;