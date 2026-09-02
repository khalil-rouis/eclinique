import { grabSession } from '$lib/session';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    const session = await grabSession(cookies.get("USID"));
    if (!session || session.type != 'clinic') {
        cookies.delete("USID", { path: '/' });
        redirect(307, "/clinique/bonjour");
    }
    
    return session;
};