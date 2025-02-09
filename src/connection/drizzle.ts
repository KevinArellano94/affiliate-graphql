import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';


function drizzleConnection() {
    const sql = neon(process.env.DATABASE_URL as string);
    const db = drizzle({ client: sql });

    return db;
}

export default drizzleConnection;