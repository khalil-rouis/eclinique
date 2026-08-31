import { t as accountsColl } from "./mongodb.js";
import { r as redisClient } from "./redis.js";
import { ObjectId } from "mongodb";
//#region src/lib/session.ts
var grabSession = async (USID) => {
	if (!USID) return null;
	const redSess = await redisClient.get(USID);
	if (!redSess) return null;
	const isVerified = redSess.substring(0, 2) != "X#";
	const accId = redSess.substring(isVerified ? 0 : 2);
	const account = await accountsColl.findOne({ _id: new ObjectId(accId) });
	if (!account) return null;
	return {
		isVerified,
		clinic_name: account.clinic_name,
		doctor_name: account.doctor_name,
		clinic_spec: account.clinic_spec
	};
};
var deleteSession = async (USID) => {
	if (!USID) return null;
	const redSess = await redisClient.get(USID);
	if (!redSess) return null;
	const isVerified = redSess.substring(0, 2) != "X#";
	const id = redSess.substring(isVerified ? 0 : 2);
	const prevSessCount = await redisClient.get(id);
	if (prevSessCount != null) {
		const newSessCount = Number(prevSessCount) - 1;
		if (newSessCount > 0) await redisClient.set(id, String(newSessCount));
		else await redisClient.del(id);
	}
	await redisClient.del(USID);
};
//#endregion
export { grabSession as n, deleteSession as t };
