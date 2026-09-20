import { accountsColl } from "$lib/mongodb";
import { redisClient } from "$lib/redis";
import { ObjectId } from "mongodb";
import { sendRequest } from "./sms_api";

function generateFourDigitOTP() {
  const num = Math.floor(Math.random() * 10000);
  return String(num).padStart(4, '0');
}

export const sendSMSVerificationMsg = async (accId: string): Promise<boolean> => {
    const account = await accountsColl.findOne({ _id: new ObjectId(accId) });
    if (!account || (account as any).verified || !(account as any).phone) return false;

    const code = generateFourDigitOTP();
    const message = "Votre code de vérification: " + code;
    const phone_number = (account as any).phone as string;

    const api_req = await sendRequest(message, phone_number);
    if (!api_req) return false;

    await redisClient.set("VERIF" + accId, code);

    return true;
}