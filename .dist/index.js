"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const utils_keyvaluecache_1 = require("@apollo/utils.keyvaluecache");
const index_1 = __importDefault(require("./typeDefs/index"));
const index_2 = __importDefault(require("./resolvers/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
}
async function main() {
    const server = new server_1.ApolloServer({
        typeDefs: await index_1.default,
        resolvers: await index_2.default,
        cache: new utils_keyvaluecache_1.InMemoryLRUCache({
            maxSize: Math.pow(2, 20) * 1000,
            ttl: Math.pow(2, 20) * 1,
        }),
        persistedQueries: false,
        introspection: true
    });
    const { url } = await (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 4000 },
        context: async ({ req }) => {
            // const token = req.headers.authorization || '';
            const token = req.headers.authorization?.split('Bearer ')[1];
            if (!token) {
                throw new Error('Authorization token is required');
            }
            try {
                if (token) {
                    const decoded = verifyToken(token);
                    return {
                        user: {
                            id: decoded.userId,
                            role: decoded.role
                        }
                    };
                }
                return { user: null };
            }
            catch (error) {
                return { user: null };
            }
            return { token };
        }
    });
    console.log(`🚀  Server ready at: ${url}`);
}
main().then();
