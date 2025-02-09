"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const graphql_1 = require("graphql");
const drizzle_1 = __importDefault(require("../connection/drizzle"));
const performance_1 = __importDefault(require("../models/performance"));
const db = (0, drizzle_1.default)();
const drizzle_orm_1 = require("drizzle-orm");
exports.Query = {
    performances: async (_, __, ___, info) => {
        try {
            return await db
                .select()
                .from(performance_1.default);
        }
        catch (error) {
            console.error("Error fetching performances:", error);
        }
    },
    performance: async (_, { userId, linkId, platform }, ___, info) => {
        const whereConditions = [];
        if (userId) {
            whereConditions.push((0, drizzle_orm_1.eq)(performance_1.default.userId, userId));
        }
        if (linkId) {
            whereConditions.push((0, drizzle_orm_1.eq)(performance_1.default.linkId, linkId));
        }
        if (platform) {
            whereConditions.push((0, drizzle_orm_1.eq)(performance_1.default.platform, platform));
        }
        const whereClause = whereConditions.length > 0
            ? (0, drizzle_orm_1.and)(...whereConditions)
            : undefined;
        try {
            return await db
                .select()
                .from(performance_1.default)
                .where(whereClause);
        }
        catch (error) {
            console.error("Error fetching performance:", error);
        }
    }
};
exports.Mutation = {
    refreshPerformance: async (_, { input }, ___, info) => {
        try {
            await db.execute(`
                REFRESH MATERIALIZED VIEW CONCURRENTLY affiliate_performance
            `);
            return {
                success: true,
                refreshedAt: new Date().toISOString()
            };
        }
        catch (error) {
            console.error("Error refreshing performance materialized view:", error.message);
            throw new graphql_1.GraphQLError("Failed to refresh performance metrics", {
                extensions: {
                    code: "REFRESH_ERROR",
                    details: error.message
                }
            });
        }
    }
};
