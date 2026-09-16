const fs = require('fs');
const mongoose = require('mongoose');

async function testTlsVariants() {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/MONGODB_URI=(.*)/);
    let uri = match ? match[1].trim().replace(/^["']|["']$/g, '') : null;

    const testOpts = [
        { name: "tls: true", opts: { tls: true } },
        { name: "tlsInsecure: true", opts: { tls: true, tlsInsecure: true } },
        { name: "ssl: true", opts: { ssl: true } },
        { name: "tlsAllowInvalidCertificates: true", opts: { tlsAllowInvalidCertificates: true } },
        { name: "retryWrites=true&w=majority with no extra params", opts: {} }
    ];

    for (const t of testOpts) {
        try {
            console.log(`\n--- Testing ${t.name} ---`);
            const conn = await mongoose.createConnection(uri, {
                ...t.opts,
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000
            }).asPromise();

            console.log(`SUCCESS with ${t.name}!`);
            const db = conn.db;
            const collections = await db.listCollections().toArray();
            console.log("Collections:", collections.map(c => c.name));

            const leads = await db.collection('partnerleads').find({}).limit(5).toArray();
            console.log("Sample Leads fetched count:", leads.length);
            console.log("Leads sample:", leads.map(l => ({
                ref: l.referenceNo,
                customer: l.customerName,
                status: l.leadStatus,
                amount: l.applicationAmount
            })));

            const partners = await db.collection('partnerapplications').find({}).limit(5).toArray();
            console.log("Sample Partners fetched count:", partners.length);
            console.log("Partners sample:", partners.map(p => ({
                ref: p.referenceNo,
                name: p.name,
                status: p.status
            })));

            await conn.close();
            return t.opts;
        } catch (err) {
            console.log(`Failed ${t.name}:`, err.message);
        }
    }
}

testTlsVariants();
