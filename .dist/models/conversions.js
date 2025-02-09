"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const conversions = (0, pg_core_1.pgTable)('conversions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    linkId: (0, pg_core_1.uuid)('link_id').notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 12, scale: 2 }).notNull(),
    status: (0, pg_core_1.text)('status').notNull(),
    /**
     * @description transaction_data can be one of the following:
     * - pending: transaction is still processing
     * - completed: transaction has been processed successfully
     * - failed: transaction processing failed
     * - refunded: transaction has been refunded
     */
    transactionData: (0, pg_core_1.jsonb)('transaction_data').notNull().default({}),
    convertedAt: (0, pg_core_1.timestamp)('converted_at').defaultNow().notNull(),
});
exports.default = conversions;
