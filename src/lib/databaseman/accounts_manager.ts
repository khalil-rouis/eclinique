import { sha256 } from "$lib";
import { accountsColl } from "$lib/mongodb";
import type { ClinicInformation, PatientInformation } from "$lib/types";

export const setupNewAccount = async (acc_info: ClinicInformation): Promise<string | any> => {
    acc_info.reg_password = await sha256(acc_info.reg_password as string);
    (acc_info as any).verified = false;
    (acc_info as any).type = "clinic";

    try {
        return (await accountsColl.insertOne(acc_info as any)).insertedId.toString();
    }
    catch (error: any) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return { error: true, dup_field: Object.keys(error.keyValue)[0] };
        }
        else return { error: true, dup_field: "unknown" };
    }
}

export const setupNewPatientAccount = async (acc_info: PatientInformation): Promise<string | any> => {
    acc_info.reg_password = await sha256(acc_info.reg_password as string);
    (acc_info as any).verified = false;
    (acc_info as any).type = "client";

    try {
        return (await accountsColl.insertOne(acc_info as any)).insertedId.toString();
    }
    catch (error: any) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return { error: true, dup_field: Object.keys(error.keyValue)[0] };
        }
        else return { error: true, dup_field: "unknown" };
    }
}