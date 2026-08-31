import { t as deleteSession } from "../../../../chunks/session.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/patient/aurevoire/+page.server.ts
var load = async ({ cookies }) => {
	await deleteSession(cookies.get("USID"));
	cookies.delete("USID", { path: "/" });
	redirect(307, "/patient/bonjour");
};
//#endregion
export { load };
