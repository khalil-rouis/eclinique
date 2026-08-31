import { createClient } from "redis";

export const redisClient = createClient({ url: 'redis://localhost:6379' });
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export const connectRedis = async () => {
    await redisClient.connect();
    console.log('Successfully connected to Redis!');
}

export const disRedis = () => redisClient.destroy();