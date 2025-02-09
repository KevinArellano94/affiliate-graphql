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


const affiliateLinks = pgTable('affiliate_links', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    urlSlug: varchar('url_slug', { length: 100 }).notNull().unique(),
    targetUrl: text('target_url').notNull(),

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
    platform: varchar('platform', { length: 50 }).notNull(),
    metadata: jsonb('metadata').notNull().default({}),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').defaultNow().notNull(),
});


export default affiliateLinks;