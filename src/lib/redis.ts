import { createClient } from "redis";
import { MONGO_URL } from "$env/static/private";

export const redisClient = createClient({ url: MONGO_URL });
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export const connectRedis = async () => {
    await redisClient.connect();
    console.log('Successfully connected to Redis!');
}

export const disRedis = () => redisClient.destroy();