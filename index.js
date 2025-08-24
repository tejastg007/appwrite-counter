import { Client, Databases } from 'node-appwrite'


export default async ({ req, res, log, error }) => {
    try {
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_API_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID)
            .setKey(process.env.APPWRITE_API_KEY);

        const databases = new Databases(client);
        const databaseId = process.env.APPWRITE_DATABASE_ID
        const collectionId = process.env.APPWRITE_COLLECTION_ID
        await databases.createDocument(
            databaseId,
            collectionId,
            'unique()',
            { timestamp: new Date().toISOString() }
        )
        const allDocs = await databases.listDocuments(databaseId, collectionId);
        const totalVisits = allDocs.total || 0;
        return res.json({ totalVisits });
    } catch (err) {
        error(err)
        return res.json({ totalVisits: 0 });
    }
}