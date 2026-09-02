import { ObjectId } from "mongodb";
import { accountsColl } from "./mongodb";
import { redisClient } from "./redis";
import type { ClinicInformation, PatientInformation } from "./types";

export const grabSession = async (USID: string | undefined): Promise<(PatientInformation | ClinicInformation) | null> => {
    if (!USID) return null;
    const redSess = await redisClient.get(USID);
    if (!redSess) return null;
    const isVerified = redSess.substring(0, 2) != "X#";
    const accId = redSess.substring(isVerified ? 0 : 2);

    const accDoc = await accountsColl.findOne( { _id: new ObjectId(accId) } ) as any;
    if (!accDoc) return null;
    accDoc._id = (accDoc._id as ObjectId).toString();
    accDoc.reg_password = null;

    let account:PatientInformation | ClinicInformation;
    if (accDoc.type == "clinic") account = accDoc as ClinicInformation;
    else account = accDoc as PatientInformation;
    
    return account;
}

export const deleteSession = async (USID: string | undefined) => {
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
}