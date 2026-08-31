import { t as ClinicInformationSchema } from "../../../../chunks/types.js";
import { t as setupNewAccount } from "../../../../chunks/accounts_manager.js";
import { error, redirect } from "@sveltejs/kit";
//#region src/routes/clinique/nouveau/+server.ts
var POST = async ({ request }) => {
	const provided_information = await request.json();
	let firstCheck = Object.keys(provided_information).map((key) => !provided_information[key] ? key : void 0).filter((x) => x);
	if (firstCheck.length > 0) return error(400, JSON.stringify(firstCheck));
	const parseResult = ClinicInformationSchema.safeParse(provided_information);
	if (parseResult.error) return error(400, JSON.stringify(parseResult.error.issues.map((err) => err.path[0])));
	const newUserId = await setupNewAccount(provided_information);
	if (typeof newUserId != "string" && newUserId.error) return error(409, newUserId.dup_field);
	return redirect(302, "/..");
};
//#endregion
export { POST };
