import { n as connectMongo, r as disMongo } from "../chunks/mongodb.js";
import { n as disRedis, t as connectRedis } from "../chunks/redis.js";
//#region src/hooks.server.ts
var init = async () => {
	await connectMongo();
	await connectRedis();
};
var isAlrClosing = false;
var runShutdownCommand = async () => {
	if (isAlrClosing) return;
	isAlrClosing = true;
	console.log("Disconnecting Mongo DB...");
	await disMongo();
	console.log("Disconnecting Redis...");
	disRedis();
	process.exit(0);
};
process.on("SIGINT", runShutdownCommand);
process.on("SIGTERM", runShutdownCommand);
//#endregion
export { init };
