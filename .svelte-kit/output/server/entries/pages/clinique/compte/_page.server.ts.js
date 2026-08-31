import { n as grabSession } from "../../../../chunks/session.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/clinique/compte/+page.server.ts
var load = async ({ cookies }) => {
	const session = await grabSession(cookies.get("USID"));
	if (!session) {
		cookies.delete("USID", { path: "/" });
		redirect(307, "/clinique/bonjour");
	}
	return session;
};
//#endregion
export { load };
