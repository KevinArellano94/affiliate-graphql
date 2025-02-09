import { GraphQLError } from 'graphql';
import drizzleConnection from "../connection/drizzle";
import affiliateLinks from "../models/links";
const db = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, asc, desc, count } from "drizzle-orm";


export const Query = {
    links: async (_: any, __: any, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(affiliateLinks);
        } catch (error) {
            console.error("Error fetching links:", error);
            throw new GraphQLError("Error fetching links", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    },
    link: async (_: any, { userId }: { userId: string }, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(affiliateLinks)
                .where(eq(affiliateLinks.userId, userId));
        } catch (error) {
            console.error("Error fetching link:", error);
            throw new GraphQLError("Error fetching link", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
}

export const Mutation = {
    addLink: async (_: any, { input }: any, ___: any, info: any) => {
        try {
            const result = await db.insert(affiliateLinks).values(input).returning();
            return [result[0]];
        } catch (error: any) {
            console.error("Error adding link:", error.message);
            throw new GraphQLError("Error adding link", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
}
