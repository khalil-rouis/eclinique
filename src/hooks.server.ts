import { connectMongo, disMongo } from "$lib/mongodb"
import { connectRedis, disRedis } from "$lib/redis";

export const init = async () => {
    await connectMongo();
    await connectRedis();
}

let isAlrClosing = false;

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