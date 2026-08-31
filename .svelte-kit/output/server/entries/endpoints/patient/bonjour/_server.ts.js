import { n as generateSecureHex32, r as sha256 } from "../../../../chunks/lib.js";
import { i as PatientLoginInformationSchema } from "../../../../chunks/types.js";
import { t as accountsColl } from "../../../../chunks/mongodb.js";
import { r as redisClient } from "../../../../chunks/redis.js";
import { error, redirect } from "@sveltejs/kit";
//#region src/routes/patient/bonjour/+server.ts
var POST = async ({ request, cookies }) => {
	const login_information = await request.json();
	const x = cookies.get("USID");
	if (x) {
		if (await redisClient.get(x) != null) return redirect(303, "/patient/compte");
	}
	if (!login_information.phone_number) return error(400, "Bad request!");
	login_information.phone_number = login_information.phone_number?.trim() === "" ? void 0 : login_information.phone_number;
	if (PatientLoginInformationSchema.safeParse(login_information).error) return error(400, "Bad request!");
	login_information.password = await sha256(login_information.password);
	const user = await accountsColl.findOne({ phone: login_information.phone_number });
	if (user == null || user.reg_password != login_information.password) return error(401, "Bad login information!");
	const prevSess = await redisClient.get(user._id.toString());
	if (prevSess != null && Number(prevSess) > 2) return error(401, "Too many sessions!");
	const newUSID = generateSecureHex32();
	redisClient.set(newUSID, (!user.verified ? "X#" : "") + user._id.toString(), { EX: 86400 });
	redisClient.set(user._id.toString(), String((prevSess != null ? Number(prevSess) : 0) + 1));
	cookies.set("USID", newUSID, {
		path: "/",
		secure: true,
		maxAge: 86400
	});
	return redirect(303, "/patient/compte");
};
//#endregion
export { POST };
