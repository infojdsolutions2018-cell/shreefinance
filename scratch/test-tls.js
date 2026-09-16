const fs = require('fs');
const mongoose = require('mongoose');

async function testConnection() {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/MONGODB_URI=(.*)/);
    let uri = match ? match[1].trim().replace(/^["']|["']$/g, '') : null;

    console.log("Testing connection configurations...");

    const configs = [
        { name: "Default + family: 4", options: { family: 4 } },
        { name: "tlsAllowInvalidCertificates", options: { tlsAllowInvalidCertificates: true, family: 4 } },
        { name: "ssl: true, family: 4", options: { ssl: true, family: 4 } },
        { name: "direct URI options", options: { family: 4, serverSelectionTimeoutMS: 5000 } }
    ];

    for (const cfg of configs) {
        try {
            console.log(`Trying ${cfg.name}...`);
            await mongoose.connect(uri, { ...cfg.options, serverSelectionTimeoutMS: 5000 });
            console.log(`SUCCESS with: ${cfg.name}!`);
            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();
            console.log("Collections:", collections.map(c => c.name));

            const leadsCount = await db.collection('partnerleads').countDocuments();
            const partnersCount = await db.collection('partnerapplications').countDocuments();
            console.log(`Counts -> Leads: ${leadsCount}, Partners: ${partnersCount}`);
            
            await mongoose.disconnect();
            return cfg;
        } catch (e) {
            console.log(`Failed ${cfg.name}:`, e.message);
            await mongoose.disconnect().catch(() => {});
        }
    }
}

testConnection();
