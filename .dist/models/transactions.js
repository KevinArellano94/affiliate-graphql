"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const accountTransactions = (0, pg_core_1.pgTable)('account_transactions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(),
    conversionId: (0, pg_core_1.uuid)('conversion_id').notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 12, scale: 2 }).notNull(),
    /**
     * @description transaction_type can be one of the following:
     * - commission: transaction is a commission
     * - withdrawal: transaction is a withdrawal
     * - refund: transaction is a refund
     * - adjustment: transaction is an adjustment
     */
    transactionType: (0, pg_core_1.varchar)('transaction_type').notNull(),
    /**
     * @description status can be one of the following:
     * - pending: transaction is still processing
     * - completed: transaction has been processed successfully
     * - failed: transaction processing failed
     */
    status: (0, pg_core_1.varchar)('status').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.default = accountTransactions;
