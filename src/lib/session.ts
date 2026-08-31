import { ObjectId } from "mongodb";
import { accountsColl } from "./mongodb";
import { redisClient } from "./redis";
import type { ClinicInformation } from "./types";

export const grabSession = async (USID: string | undefined) => {
    if (!USID) return null;
    const redSess = await redisClient.get(USID);
    if (!redSess) return null;
    const isVerified = redSess.substring(0, 2) != "X#";
    const accId = redSess.substring(isVerified ? 0 : 2);
    const account:ClinicInformation | null = await accountsColl.findOne( { _id: new ObjectId(accId) } ) as ClinicInformation | null;
    if (!account) return null;
    return { isVerified, clinic_name: account.clinic_name, doctor_name: account.doctor_name, clinic_spec: account.clinic_spec };
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