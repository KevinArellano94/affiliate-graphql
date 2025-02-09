"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const graphql_1 = require("graphql");
const drizzle_1 = __importDefault(require("../connection/drizzle"));
const clicks_1 = __importDefault(require("../models/clicks"));
const db = (0, drizzle_1.default)();
const drizzle_orm_1 = require("drizzle-orm");
exports.Query = {
    clicks: async (_, __, ___, info) => {
        try {
            return await db
                .select()
                .from(clicks_1.default);
        }
        catch (error) {
            console.error("Error fetching clicks:", error);
        }
    },
    click: async (_, { linkId }, ___, info) => {
        try {
            return await db
                .select()
                .from(clicks_1.default)
                .where((0, drizzle_orm_1.eq)(clicks_1.default.linkId, linkId));
        }
        catch (error) {
            console.error("Error fetching click:", error);
        }
    }
};
exports.Mutation = {
    addClick: async (_, { input }, ___, info) => {
        try {
            const result = await db.insert(clicks_1.default).values(input).returning();
            return [result[0]];
        }
        catch (error) {
            console.error("Error adding click:", error.message);
            throw new graphql_1.GraphQLError("Error adding click", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
};
