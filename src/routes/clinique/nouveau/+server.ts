import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";
import { ClinicInformationSchema, type ClinicInformation } from "$lib/types.js";
import { setupNewAccount } from "$lib/databaseman/accounts_manager.js";

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
    const provided_information:ClinicInformation = await request.json();
    
    let firstCheck = Object.keys(provided_information).map(key => !(provided_information as any)[key] ? key : undefined).filter(x => x);
    
    if (firstCheck.length > 0) {
        return error(400, JSON.stringify(firstCheck));
    }

    const parseResult = ClinicInformationSchema.safeParse(provided_information);
    if (parseResult.error) {
        return error(400, JSON.stringify(parseResult.error.issues.map(err => err.path[0])));
    }
    const newUserId: string | any = await setupNewAccount(provided_information);
    if (typeof newUserId != "string" && newUserId.error) {
        return error(409, newUserId.dup_field);
    }
    // setup phone verification with an id

    return redirect(302, "/..");
}