import { createClient } from "redis";
import { env } from '$env/dynamic/private'

export const redisClient = createClient({ url: env.REDIS_URL });
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export const connectRedis = async () => {
    await redisClient.connect();
    console.log('Successfully connected to Redis!');
}

export const disRedis = () => redisClient.destroy();