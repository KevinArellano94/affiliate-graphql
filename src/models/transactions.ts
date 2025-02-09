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


const accountTransactions = pgTable('account_transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    conversionId: uuid('conversion_id').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),

    /**
     * @description transaction_type can be one of the following:
     * - commission: transaction is a commission
     * - withdrawal: transaction is a withdrawal
     * - refund: transaction is a refund
     * - adjustment: transaction is an adjustment
     */
    transactionType: varchar('transaction_type').notNull(),
    
    /**
     * @description status can be one of the following:
     * - pending: transaction is still processing
     * - completed: transaction has been processed successfully
     * - failed: transaction processing failed
     */
    status: varchar('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});


export default accountTransactions;