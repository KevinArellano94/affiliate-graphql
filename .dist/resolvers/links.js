"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const graphql_1 = require("graphql");
const drizzle_1 = __importDefault(require("../connection/drizzle"));
const links_1 = __importDefault(require("../models/links"));
const db = (0, drizzle_1.default)();
const drizzle_orm_1 = require("drizzle-orm");
exports.Query = {
    links: async (_, __, ___, info) => {
        try {
            return await db
                .select()
                .from(links_1.default);
        }
        catch (error) {
            console.error("Error fetching links:", error);
            throw new graphql_1.GraphQLError("Error fetching links", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    },
    link: async (_, { userId }, ___, info) => {
        try {
            return await db
                .select()
                .from(links_1.default)
                .where((0, drizzle_orm_1.eq)(links_1.default.userId, userId));
        }
        catch (error) {
            console.error("Error fetching link:", error);
            throw new graphql_1.GraphQLError("Error fetching link", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
};
exports.Mutation = {
    addLink: async (_, { input }, ___, info) => {
        try {
            const result = await db.insert(links_1.default).values(input).returning();
            return [result[0]];
        }
        catch (error) {
            console.error("Error adding link:", error.message);
            throw new graphql_1.GraphQLError("Error adding link", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
};
