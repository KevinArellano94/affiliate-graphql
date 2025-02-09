import * as fs from 'fs/promises';
import * as path from 'path';


async function loadTypeDefs(): Promise<string[]> {
    const typeDefs: string[] = [];
    const directoryPath = path.resolve(__dirname);
    
    try {
        const files = await fs.readdir(directoryPath);
        
        for (const file of files) {
            if (file.endsWith('.graphql')) {
                const filePath = path.join(directoryPath, file);
                const content = await fs.readFile(filePath, 'utf-8');
                typeDefs.push(content);
            }
        }
        
        return typeDefs;
    } catch (error) {
        console.error('Error loading type definitions:', error);
        return [];
    }
}

export const typeDefsPromise = loadTypeDefs();
export default typeDefsPromise;