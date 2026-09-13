import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appointmentsColl } from '$lib/mongodb';
import { grabSession } from '$lib/session';

export const GET: RequestHandler = async ({ url, cookies }) => {
	if (!cookies.get('USID')) throw error(401, 'Bad session!');
	const USID = cookies.get('USID');
	const session = await grabSession(USID);
	if (!session || !session.verified) {
		throw error(401, 'Compte non verifié!');
	}

	const ccid = url.searchParams.get('ccid');
	if (!ccid) {
		throw error(400, 'Paramètre ccid manquant');
	}

	const rendezvous = await appointmentsColl
		.find(
			{ clientId: (session as any)._id, ccid },
			{ projection: { _id: 0, timestamp: 1 } }
		)
		.sort({ timestamp: -1 })
		.toArray();

	return json(rendezvous);
};