import { error, json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";
import { PatientLoginInformationSchema, type PatientLoginInformation } from "$lib/types.js";
import { accountsColl } from "$lib/mongodb.js";
import { generateSecureHex32, sha256 } from "$lib";
import { redisClient } from "$lib/redis.js";

export const POST: RequestHandler = async ({ request, cookies }): Promise<Response> => {
    const login_information: PatientLoginInformation = await request.json();
    const x = cookies.get("USID");
    if (x) {
        const session = await redisClient.get(x);
        if (session != null) return redirect(303, "/patient/compte");
    }
    if (!login_information.phone_number) return error(400, 'Bad request!');
    login_information.phone_number = login_information.phone_number?.trim() === "" ? undefined : login_information.phone_number;

    if (PatientLoginInformationSchema.safeParse(login_information).error) {
        return error(400, 'Bad request!');
    }
    login_information.password = await sha256(login_information.password);
    const user = await accountsColl.findOne({ phone: login_information.phone_number });
    if (user == null || (user as any).reg_password != login_information.password) return error(401, "Bad login information!")
    const prevSess = await redisClient.get(user._id.toString());
    if (prevSess != null && Number(prevSess) > 2) {
        return error(401, 'Too many sessions!');
    }
    const newUSID = generateSecureHex32();
    redisClient.set(newUSID, (!(user as any).verified ? "X#" : "") + user._id.toString(), { EX: 60 * 60 * 24 });
    redisClient.set(user._id.toString(), String((prevSess != null ? Number(prevSess) : 0) + 1));
    cookies.set("USID", newUSID, { path: "/", secure: true, maxAge: 60 * 60 * 24 })
    return redirect(303, "/patient/compte");
};