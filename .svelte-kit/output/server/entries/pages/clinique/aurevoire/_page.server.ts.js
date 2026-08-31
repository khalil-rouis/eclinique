import { t as deleteSession } from "../../../../chunks/session.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/clinique/aurevoire/+page.server.ts
var load = async ({ cookies }) => {
	await deleteSession(cookies.get("USID"));
	cookies.delete("USID", { path: "/" });
	redirect(307, "/clinique/bonjour");
};
//#endregion
export { load };
