import { MongoClient } from "mongodb";
//#region \0virtual:env/static/private
/** @type {import('$env/static/private').MONGO_DB} */
var MONGO_DB = "pointiclinique";
/** @type {import('$env/static/private').MONGO_URL} */
var MONGO_URL = "mongodb://localhost:27017";
/** @type {import('$env/static/private').REDIS_URL} */
var REDIS_URL = "redis://localhost:6379";
//#endregion
//#region src/lib/mongodb.ts
var client = new MongoClient(MONGO_URL);
var accountsColl;
var connectMongo = async () => {
	await client.connect();
	console.log("Connected successfully to Mongo DB");
	const db = client.db(MONGO_DB);
	accountsColl = db.collection("comptes");
	db.collection("rendez_vous");
	console.log("Defined Mongo DB collections successfully");
	await accountsColl.createIndex({ reg_email: 1 }, {
		unique: true,
		sparse: true
	});
	await accountsColl.createIndex({ phone: 1 }, { unique: true });
};
var disMongo = async () => {
	await client.close();
};
//#endregion
export { REDIS_URL as i, connectMongo as n, disMongo as r, accountsColl as t };
