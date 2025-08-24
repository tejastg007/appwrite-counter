import { Client, Databases } from 'node-appwrite'


export default async ({ req, res, log, error }) => {
    const allowedOrigins = ['http://localhost:5173/', 'https://mydomain.com']
    const origin = req.headers['origin']
    if (allowedOrigins.includes(origin)) {
        res.headers.append('Access-Control-Allow-Origin', origin)
    }
    res.headers.append('Access-Control-Allow-Origin', '*')
    res.headers.append('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.headers.append('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.json({}, 200) // respond OK for preflight
    } try {
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
            {
                Count: 1, // or any number
                CreatedAt: new Date().toISOString()
            }
        )
        const allDocs = await databases.listDocuments(databaseId, collectionId);
        const totalVisits = allDocs.total || 0;
        return res.json({ totalVisits });
    } catch (err) {
        error(err)
        return res.json({ totalVisits: 0 });
    }
}