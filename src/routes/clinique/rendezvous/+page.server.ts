import { accountsColl } from '$lib/mongodb';
import { grabSession } from '$lib/session';
import { ObjectId } from 'mongodb';
import type { PageServerLoad } from './$types';
import type { ClinicInformation } from '$lib/types';

export const ssr = false;
export const load: PageServerLoad = async ({ url, cookies, request }) => {
    if (!cookies.get("USID")) return { error: "Bad session!" };
    const USID = cookies.get("USID");
    const session = await grabSession(USID);
    if (!session || !session.verified /*|| session.type != "client" */) return { error: "Unverified acc!" };
    const ccid = url.searchParams.get("ccid");
    if (!ccid) return { error: "Bad ccid!" };
    const clinicInfo = (await accountsColl.findOne({ "_id": new ObjectId(ccid.toString()) }) as unknown) as ClinicInformation;
    if (!clinicInfo || clinicInfo.type != "clinic") return { error: "Bad ccid!" };
    clinicInfo._id = (clinicInfo._id as ObjectId).toString();

    return { ...clinicInfo };
}