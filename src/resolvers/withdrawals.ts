import { GraphQLError } from 'graphql';
import drizzleConnection from "../connection/drizzle.ts";
import withdrawals from '../models/withdrawals.ts';
const db = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, asc, desc, count, and } from "drizzle-orm";


export const Query = {
    withdrawals: async (_: any, __: any, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(withdrawals);
        } catch (error) {
            console.error("Error fetching withdrawals:", error);
        }
    },
    withdrawal: async (_: any, { transactionId, status }: { transactionId: string, status: string }, ___: any , info: any) => {
        const whereConditions = []

        if (transactionId) {
            whereConditions.push(eq(withdrawals.transactionId, transactionId));
        }
        if (status) {
            whereConditions.push(eq(withdrawals.status, status));
        }

        const whereClause = whereConditions.length > 0
            ? and(...whereConditions)
            : undefined;

        try {
            return await db
                .select()
                .from(withdrawals)
                .where(whereClause);
        } catch (error) {
            console.error("Error fetching withdrawal:", error);
        }
    }
}

export const Mutation = {
    addWithdrawal: async (_: any, { input }: any, ___: any, info: any) => {
        try {
            const result = await db.insert(withdrawals).values(input).returning();
            return [result[0]];
        } catch (error: any) {
            console.error("Error adding withdrawal:", error.message);
            throw new GraphQLError("Error adding withdrawal", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
}
