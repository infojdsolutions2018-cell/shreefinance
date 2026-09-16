const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function setAdmin() {
    try {
        const envFile = fs.readFileSync('.env.local', 'utf8');
        const match = envFile.match(/MONGODB_URI=(.*)/);
        const uri = match ? match[1].trim().replace(/^["']|["']$/g, '') : null;
        if (!uri) {
            console.error('MONGODB_URI not found in .env.local');
            return;
        }

        console.log('Connecting to database...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        const db = mongoose.connection.db;

        const targetEmail = 'sulagadleaishwarya@gmail.com';
        const rawPassword = '212405';

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(rawPassword, salt);

        const adminsCollection = db.collection('admins');

        // Check if admin already exists
        const existing = await adminsCollection.findOne({
            username: { $regex: new RegExp(`^${targetEmail}$`, 'i') }
        });

        if (existing) {
            await adminsCollection.updateOne(
                { _id: existing._id },
                { $set: { username: targetEmail, passwordHash: passwordHash } }
            );
            console.log(`Successfully updated existing admin credentials for ${targetEmail}`);
        } else {
            await adminsCollection.insertOne({
                username: targetEmail,
                passwordHash: passwordHash
            });
            console.log(`Successfully created new admin account for ${targetEmail}`);
        }

        const allAdmins = await adminsCollection.find({}, { projection: { username: 1 } }).toArray();
        console.log('Current Admin list:', allAdmins.map(a => a.username));

    } catch (err) {
        console.error('Error setting admin credentials:', err);
    } finally {
        await mongoose.disconnect();
    }
}

setAdmin();
