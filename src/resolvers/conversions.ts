import { GraphQLError } from 'graphql';
import drizzleConnection from "../connection/drizzle";
import conversions from "../models/conversions";
const db = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, asc, desc, count } from "drizzle-orm";


export const Query = {
    conversions: async (_: any, __: any, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(conversions);
        } catch (error) {
            console.error("Error fetching conversions:", error);
        }
    },
    conversion: async (_: any, { linkId }: { linkId: string }, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(conversions)
                .where(eq(conversions.linkId, linkId));
        } catch (error) {
            console.error("Error fetching conversion:", error);
        }
    }
}

export const Mutation = {
    addConversion: async (_: any, { input }: any, ___: any, info: any) => {
        try {
            const result = await db.insert(conversions).values(input).returning();
            return [result[0]];
        } catch (error: any) {
            console.error("Error adding conversion:", error.message);
            throw new GraphQLError("Error adding conversion", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
}
