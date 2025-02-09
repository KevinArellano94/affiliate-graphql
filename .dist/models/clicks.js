"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const linkClicks = (0, pg_core_1.pgTable)('link_clicks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    linkId: (0, pg_core_1.uuid)('link_id').notNull(),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 50 }).notNull(),
    userAgent: (0, pg_core_1.text)('user_agent').notNull(),
    clickedAt: (0, pg_core_1.timestamp)('clicked_at').defaultNow().notNull(),
    geoData: (0, pg_core_1.jsonb)('geo_data').notNull().default({}),
});
exports.default = linkClicks;
