import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteSession } from '$lib/session';

export const load: PageServerLoad = async ({cookies}) => {
    await deleteSession(cookies.get("USID"));
    cookies.delete("USID", { path: "/" });
    redirect(307, "/patient/bonjour");
}
