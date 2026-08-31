import { connectMongo, disMongo } from "$lib/mongodb"
import { connectRedis, disRedis } from "$lib/redis";
import { building } from '$app/environment';

export const init = async () => {
    if (!building) {
        await connectMongo();
        await connectRedis();
    }
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

export async function handle({ event, resolve }) {
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // or specific origin
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  const response = await resolve(event);
  response.headers.append('Access-Control-Allow-Origin', '*');
  return response;
}