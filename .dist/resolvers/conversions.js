"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const graphql_1 = require("graphql");
const drizzle_1 = __importDefault(require("../connection/drizzle"));
const conversions_1 = __importDefault(require("../models/conversions"));
const db = (0, drizzle_1.default)();
const drizzle_orm_1 = require("drizzle-orm");
exports.Query = {
    conversions: async (_, __, ___, info) => {
        try {
            return await db
                .select()
                .from(conversions_1.default);
        }
        catch (error) {
            console.error("Error fetching conversions:", error);
        }
    },
    conversion: async (_, { linkId }, ___, info) => {
        try {
            return await db
                .select()
                .from(conversions_1.default)
                .where((0, drizzle_orm_1.eq)(conversions_1.default.linkId, linkId));
        }
        catch (error) {
            console.error("Error fetching conversion:", error);
        }
    }
};
exports.Mutation = {
    addConversion: async (_, { input }, ___, info) => {
        try {
            const result = await db.insert(conversions_1.default).values(input).returning();
            return [result[0]];
        }
        catch (error) {
            console.error("Error adding conversion:", error.message);
            throw new graphql_1.GraphQLError("Error adding conversion", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
};
