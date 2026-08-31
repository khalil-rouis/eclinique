// @ts-nocheck
import { grabSession } from '$lib/session';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
    const session = await grabSession(cookies.get("USID"));
    if (!session) {
        cookies.delete("USID", { path: '/' });
        redirect(307, "/clinique/bonjour");
    }
    
    return session;
};