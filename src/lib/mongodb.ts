import { Collection, MongoClient } from 'mongodb'
import  { MONGO_URL, MONGO_DB } from '$env/static/private';
import type { AppointmentDoc, SubscriptionPayment } from './types';

const client = new MongoClient(MONGO_URL);
export let accountsColl: Collection<Document>, appointmentsColl: Collection<AppointmentDoc>, paymentsColl: Collection<SubscriptionPayment>;

export const connectMongo = async () => {
    await client.connect();
    console.log('Connected successfully to Mongo DB');
    const db = client.db(MONGO_DB);
    accountsColl = db.collection("comptes");
    appointmentsColl = db.collection<AppointmentDoc>("rendez_vous");
    paymentsColl = db.collection<SubscriptionPayment>("payments");
    console.log('Defined Mongo DB collections successfully');

    // Using sparse indexes because there are 2 types of accounts and one has reg_email and the other doesn't.
    await accountsColl.createIndex({ reg_email: 1 }, { unique: true, sparse: true });
    await accountsColl.createIndex({ phone: 1 }, { unique: true });
}

export const disMongo = async () => {
    await client.close();
}