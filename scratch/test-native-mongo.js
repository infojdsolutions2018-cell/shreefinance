const { MongoClient } = require('mongodb');
const fs = require('fs');

async function testNative() {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/MONGODB_URI=(.*)/);
    let uri = match ? match[1].trim().replace(/^["']|["']$/g, '') : null;

    console.log("URI scheme:", uri.split('@')[0].split('://')[0], "Host:", uri.split('@')[1] ? uri.split('@')[1].split('/')[0] : 'unknown');

    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        tls: true
    });

    try {
        console.log("Connecting via MongoClient...");
        await client.connect();
        console.log("MongoClient connected successfully!");
        const db = client.db();
        const cols = await db.listCollections().toArray();
        console.log("Collections in DB:", cols.map(c => c.name));
    } catch (err) {
        console.error("MongoClient error:", err);
    } finally {
        await client.close();
    }
}

testNative();
