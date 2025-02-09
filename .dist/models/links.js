"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const affiliateLinks = (0, pg_core_1.pgTable)('affiliate_links', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(),
    urlSlug: (0, pg_core_1.varchar)('url_slug', { length: 100 }).notNull().unique(),
    targetUrl: (0, pg_core_1.text)('target_url').notNull(),
    /**
     * @description platform can be one of the following:
     * - youtube: link is for youtube
     * - x: link is for x
     * - instagram: link is for instagram
     * - tiktok: link is for tiktok
     * - facebook: link is for facebook
     * - linkedin: link is for linkedin
     * - other: link is for other platforms
     */
    platform: (0, pg_core_1.varchar)('platform', { length: 50 }).notNull(),
    metadata: (0, pg_core_1.jsonb)('metadata').notNull().default({}),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').defaultNow().notNull(),
});
exports.default = affiliateLinks;
