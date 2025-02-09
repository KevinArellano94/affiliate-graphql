"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const graphql_1 = require("graphql");
const drizzle_1 = __importDefault(require("../connection/drizzle"));
const transactions_1 = __importDefault(require("../models/transactions"));
const db = (0, drizzle_1.default)();
const drizzle_orm_1 = require("drizzle-orm");
exports.Query = {
    transactions: async (_, __, ___, info) => {
        try {
            return await db
                .select()
                .from(transactions_1.default);
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
        }
    },
    transaction: async (_, { userId }, ___, info) => {
        try {
            return await db
                .select()
                .from(transactions_1.default)
                .where((0, drizzle_orm_1.eq)(transactions_1.default.userId, userId));
        }
        catch (error) {
            console.error("Error fetching transaction:", error);
        }
    }
};
exports.Mutation = {
    addTransaction: async (_, { input }, ___, info) => {
        try {
            const result = await db.insert(transactions_1.default).values(input).returning();
            return [result[0]];
        }
        catch (error) {
            console.error("Error adding transaction:", error.message);
            throw new graphql_1.GraphQLError("Error adding transaction", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
};
