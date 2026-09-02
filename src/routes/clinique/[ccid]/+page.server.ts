import { grabSession } from '$lib/session';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ cookies, params }) => {
    if (!cookies.get("USID")) return;
    const USID = cookies.get("USID");
    const session = await grabSession(USID);
    if (!session || !session.verified || session.type != "patient") return;

}