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


const linkClicks = pgTable('link_clicks', {
    id: uuid('id').primaryKey().defaultRandom(),
    linkId: uuid('link_id').notNull(),
    ipAddress: varchar('ip_address', { length: 50 }).notNull(),
    userAgent: text('user_agent').notNull(),
    clickedAt: timestamp('clicked_at').defaultNow().notNull(),
    geoData: jsonb('geo_data').notNull().default({}),
});


export default linkClicks;