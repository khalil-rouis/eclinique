// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteSession } from '$lib/session';

export const load = async ({cookies}: Parameters<PageServerLoad>[0]) => {
    await deleteSession(cookies.get("USID"));
    cookies.delete("USID", { path: "/" });
    redirect(307, "/clinique/bonjour");
}
