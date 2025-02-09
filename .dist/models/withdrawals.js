"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const withdrawals = (0, pg_core_1.pgTable)('withdrawals', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    transactionId: (0, pg_core_1.uuid)('transaction_id').notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 12, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)('status').notNull(),
    requestedAt: (0, pg_core_1.timestamp)('requested_at').defaultNow().notNull(),
    processedAt: (0, pg_core_1.timestamp)('processed_at'),
});
exports.default = withdrawals;
