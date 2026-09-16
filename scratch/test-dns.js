const net = require('net');

const hosts = [
    'ac-2cocyxr-shard-00-00.7fay6sp.mongodb.net',
    'ac-2cocyxr-shard-00-01.7fay6sp.mongodb.net',
    'ac-2cocyxr-shard-00-02.7fay6sp.mongodb.net'
];

for (const host of hosts) {
    const socket = new net.Socket();
    socket.setTimeout(4000);
    console.log(`Connecting to ${host}:27017...`);
    socket.connect(27017, host, () => {
        console.log(`Connected successfully to ${host}:27017 (TCP OK)`);
        socket.destroy();
    });
    socket.on('error', (err) => {
        console.log(`TCP Error on ${host}:`, err.message);
    });
    socket.on('timeout', () => {
        console.log(`Timeout connecting to ${host}:27017`);
        socket.destroy();
    });
}
