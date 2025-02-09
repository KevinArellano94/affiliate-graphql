"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const graphql_1 = require("graphql");
const drizzle_1 = __importDefault(require("../connection/drizzle"));
const users_1 = __importDefault(require("../models/users"));
const db = (0, drizzle_1.default)();
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '10m';
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hashedPassword) {
    return bcrypt_1.default.compare(password, hashedPassword);
}
async function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}
exports.Query = {
    users: async (_, __, ___, info) => {
        try {
            return await db
                .select()
                .from(users_1.default);
        }
        catch (error) {
            console.error("Error fetching user:", error);
        }
    },
    user: async (_, { email, password }, ___, info) => {
        try {
            const user = await db
                .select()
                .from(users_1.default)
                .where((0, drizzle_orm_1.eq)(users_1.default.email, email))
                .limit(1);
            if (!user[0]) {
                throw new graphql_1.GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const isValid = await verifyPassword(password, user[0].hashedPassword);
            if (!isValid) {
                throw new graphql_1.GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            if (!user[0].isActive) {
                throw new graphql_1.GraphQLError('Account is deactivated', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const token = await generateToken(user[0].id);
            // console.log(token);
            user[0].token = token;
            return user;
        }
        catch (error) {
            console.error("Error fetching user:", error);
            throw new graphql_1.GraphQLError('Invalid email or password', {
                extensions: { code: 'UNAUTHENTICATED' }
            });
        }
    }
};
exports.Mutation = {
    addUser: async (_, { input }, ___, info) => {
        try {
            input.hashedPassword = await hashPassword(input.password);
            const result = await db.insert(users_1.default).values(input).returning();
            return [result[0]];
        }
        catch (error) {
            console.error("Error adding user:", error.message);
            throw new graphql_1.GraphQLError("Error adding user", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
};
