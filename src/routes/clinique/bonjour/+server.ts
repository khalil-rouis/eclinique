import { error, json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";
import { LoginInformationSchema, type LoginInformation } from "$lib/types.js";
import { accountsColl } from "$lib/mongodb.js";
import { generateSecureHex32, sha256 } from "$lib";
import { redisClient } from "$lib/redis.js";

export const POST: RequestHandler = async ({ request, cookies }): Promise<Response> => {
    const login_information: LoginInformation = await request.json();
    const x = cookies.get("USID");
    if (x) {
        const session = await redisClient.get(x);
        if (session != null) return redirect(303, "/clinique/compte");
    }
    if (!login_information.email && !login_information.phone_number) return error(400, 'Bad request!');
    login_information.phone_number = login_information.phone_number?.trim() === "" ? undefined : login_information.phone_number;
    login_information.email = login_information.email?.trim() === "" ? undefined : login_information.email;

    if (LoginInformationSchema.safeParse(login_information).error) {
        return error(400, 'Bad request!');
    }
    login_information.password = await sha256(login_information.password);
    const searchFilter = login_information.email ? { reg_email: login_information.email } : { phone: login_information.phone_number };
    const user = await accountsColl.findOne(searchFilter);
    if (user == null || (user as any).reg_password != login_information.password) return error(401, "Bad login information!")
    const prevSess = await redisClient.get(user._id.toString());
    if (prevSess != null && Number(prevSess) > 2) {
        return error(401, 'Too many sessions!');
    }
    const newUSID = generateSecureHex32();
    redisClient.set(newUSID, (!(user as any).verified ? "X#" : "") + user._id.toString(), { EX: 60 * 60 * 24 });
    redisClient.set(user._id.toString(), String((prevSess != null ? Number(prevSess) : 0) + 1));
    cookies.set("USID", newUSID, { path: "/", secure: true, maxAge: 60 * 60 * 24 })
    return redirect(303, "/clinique/compte");
};