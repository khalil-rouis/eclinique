import { createClient } from "redis";
//#region src/lib/redis.ts
var redisClient = createClient({ url: "redis://localhost:6379" });
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
var connectRedis = async () => {
	await redisClient.connect();
	console.log("Successfully connected to Redis!");
};
var disRedis = () => redisClient.destroy();
//#endregion
export { disRedis as n, redisClient as r, connectRedis as t };
