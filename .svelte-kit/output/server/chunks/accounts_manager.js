import { r as sha256 } from "./lib.js";
import { t as accountsColl } from "./mongodb.js";
//#region src/lib/databaseman/accounts_manager.ts
var setupNewAccount = async (acc_info) => {
	acc_info.reg_password = await sha256(acc_info.reg_password);
	acc_info.verified = false;
	acc_info.type = "clinic";
	try {
		return (await accountsColl.insertOne(acc_info)).insertedId.toString();
	} catch (error) {
		if (error.name === "MongoServerError" && error.code === 11e3) return {
			error: true,
			dup_field: Object.keys(error.keyValue)[0]
		};
		else return {
			error: true,
			dup_field: "unknown"
		};
	}
};
var setupNewPatientAccount = async (acc_info) => {
	acc_info.reg_password = await sha256(acc_info.reg_password);
	acc_info.verified = false;
	acc_info.type = "client";
	try {
		return (await accountsColl.insertOne(acc_info)).insertedId.toString();
	} catch (error) {
		if (error.name === "MongoServerError" && error.code === 11e3) return {
			error: true,
			dup_field: Object.keys(error.keyValue)[0]
		};
		else return {
			error: true,
			dup_field: "unknown"
		};
	}
};
//#endregion
export { setupNewPatientAccount as n, setupNewAccount as t };
