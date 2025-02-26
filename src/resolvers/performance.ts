import { GraphQLError } from 'graphql';
import drizzleConnection from "../connection/drizzle.ts";
import performance from '../models/performance.ts';
const db = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, asc, desc, count, and } from "drizzle-orm";


export const Query = {
    performances: async (_: any, __: any, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(performance);
        } catch (error) {
            console.error("Error fetching performances:", error);
        }
    },
    performance: async (_: any, { userId, linkId, platform }: { userId: string, linkId: string, platform: string }, ___: any , info: any) => {
        const whereConditions = []

        if (userId) {
            whereConditions.push(eq(performance.userId, userId));
        }
        if (linkId) {
            whereConditions.push(eq(performance.linkId, linkId));
        }
        if (platform) {
            whereConditions.push(eq(performance.platform, platform));
        }

        const whereClause = whereConditions.length > 0
            ? and(...whereConditions)
            : undefined;
        try {
            return await db
                .select()
                .from(performance)
                .where(whereClause)
        } catch (error) {
            console.error("Error fetching performance:", error);
        }
    }
};

export const Mutation = {
    refreshPerformance: async (_: any, { input }: any, ___: any, info: any) => {
        try {
            await db.execute(`
                REFRESH MATERIALIZED VIEW CONCURRENTLY affiliate_performance
            `);

            return {
                success: true,
                refreshedAt: new Date().toISOString()
            };
        } catch (error: any) {
            console.error("Error refreshing performance materialized view:", error.message);
            throw new GraphQLError("Failed to refresh performance metrics", {
                extensions: { 
                    code: "REFRESH_ERROR",
                    details: error.message
                }
            });
        }
    }
}
