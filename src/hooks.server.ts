import { connectMongo, disMongo } from "$lib/mongodb"
import { connectRedis, disRedis } from "$lib/redis";

let isAlrClosing = false, isConnected = false;


export const init = async () => {
    if (!isConnected) {
        await connectMongo();
        await connectRedis();
        isConnected = true;
    }
}


const runShutdownCommand = async () => {
    if (isAlrClosing) return;
    isAlrClosing = true;
    console.log('Disconnecting Mongo DB...');
    await disMongo();
    console.log('Disconnecting Redis...');
    disRedis();
    process.exit(0);
}

process.on('SIGINT', runShutdownCommand);
process.on('SIGTERM', runShutdownCommand);