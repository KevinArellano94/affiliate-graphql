"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const performance = (0, pg_core_1.pgTable)('affiliate_performance', {
    linkId: (0, pg_core_1.uuid)('link_id').notNull(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(),
    platform: (0, pg_core_1.varchar)('platform', { length: 255 }).notNull(),
    totalClicks: (0, pg_core_1.integer)('total_clicks').notNull(),
    totalConversions: (0, pg_core_1.integer)('total_conversions').notNull(),
    totalRevenue: (0, pg_core_1.decimal)('total_revenue', { precision: 10, scale: 2 }).notNull(),
    totalCommission: (0, pg_core_1.decimal)('total_commission', { precision: 10, scale: 2 }).notNull(),
});
exports.default = performance;
