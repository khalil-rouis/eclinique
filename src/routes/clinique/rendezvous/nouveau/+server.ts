import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appointmentsColl } from '$lib/mongodb';
import { grabSession } from '$lib/session';
import type { AppointmentDoc } from '$lib/types';

const WORKDAY_START_HOUR = 9;
const WORKDAY_END_HOUR = 17;

/** Given a candidate date, push it to the next working day at opening time
 *  if it falls outside 9–17. Otherwise returns it unchanged. */
function clampToWorkingHours(candidate: Date): Date {
	const hour = candidate.getHours();

	if (hour >= WORKDAY_START_HOUR && hour < WORKDAY_END_HOUR) {
		return candidate;
	}

	const nextDay = new Date(candidate);
	// if we're past closing, jump to the next calendar day;
	// if we're before opening, same day is fine — just set the hour.
	if (hour >= WORKDAY_END_HOUR) {
		nextDay.setDate(nextDay.getDate() + 1);
	}
	nextDay.setHours(WORKDAY_START_HOUR, 0, 0, 0);
	return nextDay;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!cookies.get('USID')) throw error(401, 'Bad session!');
	const USID = cookies.get('USID');
	const session = await grabSession(USID);
	if (!session || !session.verified /* || session.type != "client" */) {
		throw error(401, 'Unverified acc!');
	}

	let body: { ccid?: string };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Corps de requête invalide');
	}

	const { ccid } = body;
	if (!ccid) {
		throw error(400, 'Paramètre ccid manquant');
	}

	// Find the clinic's latest appointment to schedule an hour after it
	const latest = await appointmentsColl.findOne(
		{ ccid },
		{ sort: { timestamp: -1 }, projection: { _id: 0, timestamp: 1 } }
	);

	const base = latest ? new Date((latest as Pick<AppointmentDoc, 'timestamp'>).timestamp) : new Date();
	const candidate = new Date(base.getTime() + 60 * 60 * 1000); // +1 hour
	const timestamp = clampToWorkingHours(candidate);

	const doc: AppointmentDoc = {
		clientId: (session as any)._id,
		ccid,
		timestamp
	};

	const result = await appointmentsColl.insertOne(doc);

	if (!result.acknowledged) {
		throw error(500, "Échec de l'enregistrement du rendez-vous");
	}

	return json({ timestamp }, { status: 201 });
};