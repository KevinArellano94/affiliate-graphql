import * as fs from "fs";
import * as path from "path";

async function loadResolvers() {
    const resolvers: Record<string, any> = {
        Query: {},
        Mutation: {},
        // Subscription: {}
    };

    const files = fs.readdirSync(__dirname);

    for (const file of files) {
        if (file.endsWith(".ts") && file !== path.basename(__filename)) {
            const modulePath = `./${file}`;
            const module = await import(modulePath);

            for (const [key, value] of Object.entries(module)) {
                if (resolvers[key]) {
                    Object.assign(resolvers[key], value);
                } else {
                    resolvers[key] = value;
                }
            }
        }
    }

    return resolvers;
}

const resolvers = Promise.all([loadResolvers()])
export default resolvers;
