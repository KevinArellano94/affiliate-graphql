"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const graphql_1 = require("graphql");
const drizzle_1 = __importDefault(require("../connection/drizzle"));
const withdrawals_1 = __importDefault(require("../models/withdrawals"));
const db = (0, drizzle_1.default)();
const drizzle_orm_1 = require("drizzle-orm");
exports.Query = {
    withdrawals: async (_, __, ___, info) => {
        try {
            return await db
                .select()
                .from(withdrawals_1.default);
        }
        catch (error) {
            console.error("Error fetching withdrawals:", error);
        }
    },
    withdrawal: async (_, { transactionId, status }, ___, info) => {
        const whereConditions = [];
        if (transactionId) {
            whereConditions.push((0, drizzle_orm_1.eq)(withdrawals_1.default.transactionId, transactionId));
        }
        if (status) {
            whereConditions.push((0, drizzle_orm_1.eq)(withdrawals_1.default.status, status));
        }
        const whereClause = whereConditions.length > 0
            ? (0, drizzle_orm_1.and)(...whereConditions)
            : undefined;
        try {
            return await db
                .select()
                .from(withdrawals_1.default)
                .where(whereClause);
        }
        catch (error) {
            console.error("Error fetching withdrawal:", error);
        }
    }
};
exports.Mutation = {
    addWithdrawal: async (_, { input }, ___, info) => {
        try {
            const result = await db.insert(withdrawals_1.default).values(input).returning();
            return [result[0]];
        }
        catch (error) {
            console.error("Error adding withdrawal:", error.message);
            throw new graphql_1.GraphQLError("Error adding withdrawal", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
};
