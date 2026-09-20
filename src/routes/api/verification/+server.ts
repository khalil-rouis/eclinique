import { redisClient } from "$lib/redis";
import { grabSession } from "$lib/session";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ url, cookies }): Promise<Response> => {
    const providedCode = url.searchParams.get("code");
    if (!providedCode) throw error(401, 'Code de vérification introuvable!');
    if (!cookies.get('USID')) throw error(401, 'Mauvaise session!');
    const session = await grabSession(cookies.get('USID'));
    if (!session) throw error(401, 'Compte introuvable!');
    if (session.verified) throw error(401, 'Compte déjà vérifié!');
    const accId = (session as any)._id;
    const code = await redisClient.get("VERIF" + accId);
    if (!code) throw error(401, 'Code de vérification introuvable!');
    if (providedCode != code) throw error(401, 'Code de vérification invalide!');

    return json(JSON.stringify({ success: true }));
}