import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import typeDefs from "./typeDefs/index.ts";
import resolvers from "./resolvers/index.ts";
import jwt from 'jsonwebtoken';


function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string);
}

async function main() {
    const port = process.env.PORT || 4000;
    console.log(`Attempting to start server on port ${port}`);
    
    const server = new ApolloServer({
        typeDefs: await typeDefs,
        resolvers: await resolvers,
        cache: new InMemoryLRUCache({
            maxSize: Math.pow(2, 20) * 1000,
            ttl: Math.pow(2, 20) * 1,
        }),
        persistedQueries: false,
        introspection: true
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: parseInt(port.toString()) },
        context: async ({ req }) => {
            // const token = req.headers.authorization || '';
            const token = req.headers.authorization?.split('Bearer ')[1];
            
            if (!token) {
                return { user: null };
            }

            try {
                if (token) {
                    const decoded: any = verifyToken(token);
                    return {
                        user: {
                            id: decoded.userId,
                            role: decoded.role
                        }
                    };
                }
            } catch (error) {
                return { user: null };
            }

            return { token };
        }
    });
    console.log(`🚀  Server ready at: ${url}`);
}

main().then()
