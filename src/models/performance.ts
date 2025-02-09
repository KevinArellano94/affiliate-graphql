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
    foreignKey,
    integer
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';


const performance = pgTable('affiliate_performance', {
    linkId: uuid('link_id').notNull(),
    userId: uuid('user_id').notNull(),
    platform: varchar('platform', { length: 255 }).notNull(),
    totalClicks: integer('total_clicks').notNull(),
    totalConversions: integer('total_conversions').notNull(),
    totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 }).notNull(),
    totalCommission: decimal('total_commission', { precision: 10, scale: 2 }).notNull(),
});


export default performance;