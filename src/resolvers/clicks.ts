import { GraphQLError } from 'graphql';
import drizzleConnection from "../connection/drizzle";
import linkClicks from "../models/clicks";
const db = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, asc, desc, count } from "drizzle-orm";


export const Query = {
    clicks: async (_: any, __: any, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(linkClicks);
        } catch (error) {
            console.error("Error fetching clicks:", error);
        }
    },
    click: async (_: any, { linkId }: { linkId: string }, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(linkClicks)
                .where(eq(linkClicks.linkId, linkId));
        } catch (error) {
            console.error("Error fetching click:", error);
        }
    }
};

export const Mutation = {
    addClick: async (_: any, { input }: any, ___: any, info: any) => {
        try {
            const result = await db.insert(linkClicks).values(input).returning();
            return [result[0]];
        } catch (error: any) {
            console.error("Error adding click:", error.message);
            throw new GraphQLError("Error adding click", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
}
