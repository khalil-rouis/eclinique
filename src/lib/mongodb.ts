import { Collection, Db, MongoClient } from 'mongodb'
import  { MONGO_URL, MONGO_DB } from '$env/static/private';

const client = new MongoClient(MONGO_URL);
export let accountsColl: Collection<Document>, appointmentsColl: Collection<Document>;

export const connectMongo = async () => {
    await client.connect();
    console.log('Connected successfully to Mongo DB');
    const db = client.db(MONGO_DB);
    accountsColl = db.collection("comptes");
    appointmentsColl = db.collection("rendez_vous");
    console.log('Defined Mongo DB collections successfully');

    // Using sparse indexes because there are 2 types of accounts and one has reg_email and the other doesn't.
    await accountsColl.createIndex({ reg_email: 1 }, { unique: true, sparse: true });
    await accountsColl.createIndex({ phone: 1 }, { unique: true });
}

export const disMongo = async () => {
    await client.close();
}