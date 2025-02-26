import { GraphQLError } from 'graphql';
import drizzleConnection from "../connection/drizzle.ts";
import users from "../models/users.ts";
const db = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, asc, desc, count, and } from "drizzle-orm";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET as string || 'ODBiZTkzMmQtZDc1NC00YzNlLTgzZTUtYzViNjNkNDA0OWYy'; // Should be in env
const TOKEN_EXPIRY = '10m';

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

async function generateToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export const Query = {
    users: async (_: any, __: any, ___: any , info: any) => {
        try {
            return await db
                .select()
                .from(users);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    },
    user: async (_: any, { email, password }: { email: string, password: string }, ___: any , info: any) => {
        try {
            const user: any = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);
                
            if (!user[0]) {
                throw new GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            const isValid = await verifyPassword(password, user[0].hashedPassword)

            if (!isValid) {
                throw new GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            if (!user[0].isActive) {
                throw new GraphQLError('Account is deactivated', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }

            const token = await generateToken(user[0].id);
            // console.log(token);
            user[0].token = token;
            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new GraphQLError('Invalid email or password', {
                extensions: { code: 'UNAUTHENTICATED' }
            });
        }
    }
}

export const Mutation = {
    addUser: async (_: any, { input }: any, ___: any, info: any) => {
        try {
            input.hashedPassword = await hashPassword(input.password);
            const result = await db.insert(users).values(input).returning();
            return [result[0]];
        } catch (error: any) {
            console.error("Error adding user:", error.message);
            throw new GraphQLError("Error adding user", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    },
    updateUser: async (_: any, { input }: any, ___: any, info: any) => {
        const updatePayload: any = {};

        if (!input.id) {
            console.error("Error finding user, please include an ID");
            throw new GraphQLError("Error finding user, please include an ID", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }

        if (input.password) {
            updatePayload.hashedPassword = await hashPassword(input.password);
        }
        
        if (input.fullName) {
            updatePayload.fullName = input.fullName;
        }

        if (input.contactInfo) {
            updatePayload.contactInfo = input.contactInfo;
        }

        if (input.taxInfo) {
            updatePayload.taxInfo = input.taxInfo;
        }

        if (input.bankingInfo) {
            updatePayload.bankingInfo = input.bankingInfo;
        }
        
        try {
            const result = await db
                .update(users)
                .set(updatePayload)
                .where(eq(users.id, input.id))
                .returning();
            
            return [result[0]];
        } catch (error: any) {
            console.error("Error updating user:", error.message);
            throw new GraphQLError("Error updating user", {
                extensions: { code: "INTERNAL_ERROR" }
            });
        }
    }
}
