import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ObjectId } from 'mongodb';
import { appointmentsColl } from '$lib/mongodb';
import { grabSession } from '$lib/session';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	if (!cookies.get('USID')) throw error(401, 'Mauvaise session!');
	const session = await grabSession(cookies.get('USID'));
	if (!session || !session.verified) throw error(401, 'Compte non vérifié!');

	if (!ObjectId.isValid(params.id)) throw error(400, 'ID invalide');

	const { datetime } = await request.json();
	if (!datetime) throw error(400, 'Date manquante');

	const result = await appointmentsColl.updateOne(
		{ _id: new ObjectId(params.id), ccid: (session as any)._id.toString() },
		{ $set: { timestamp: new Date(datetime) } }
	);

	if (result.matchedCount === 0) throw error(404, 'Rendez-vous introuvable');

	return json({ success: true });
};