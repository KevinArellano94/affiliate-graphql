import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';


function drizzleConnection() {
    const sql = neon(process.env.DATABASE_URL as string || 'postgresql://neondb_owner:npg_aoIFw26DbVuq@ep-super-glitter-a41cu21u-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');
    const db = drizzle({ client: sql });

    return db;
}

export default drizzleConnection;