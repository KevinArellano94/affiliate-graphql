import { GraphQLError } from 'graphql';
import drizzleConnection from "../connection/drizzle";
import accountTransactions from '../models/transactions';
const db = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, asc, desc, count } from "drizzle-orm";


export const Query = {
    transactions: async (_: any, __: any, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(accountTransactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    },
    transaction: async (_: any, { userId }: { userId: string }, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(accountTransactions)
                .where(eq(accountTransactions.userId, userId));
        } catch (error) {
            console.error("Error fetching transaction:", error);
        }
    }
}

export const Mutation = {
    addTransaction: async (_: any, { input }: any, ___: any, info: any) => {
        try {
            const result = await db.insert(accountTransactions).values(input).returning();
            return [result[0]];
        } catch (error: any) {
            console.error("Error adding transaction:", error.message);
            throw new GraphQLError("Error adding transaction", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
}
