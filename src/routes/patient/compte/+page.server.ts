import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ObjectId } from 'mongodb';
import { appointmentsColl, accountsColl } from '$lib/mongodb';
import type { ClinicInformation } from '$lib/types';
import { grabSession } from '$lib/session';

export const load: PageServerLoad = async ({ cookies }) => {
	if (!cookies.get('USID')) throw redirect(303, '/patient/bonjour');
	const USID = cookies.get('USID');
	const session = await grabSession(USID);
	if (!session || !session.verified) throw redirect(303, '/patient/bonjour');

	const clientId = (session as any)._id;

	// Get every distinct clinic this patient has an upcoming appointment with
	const activeCcids = await appointmentsColl.distinct('ccid', {
		clientId,
		timestamp: { $gte: new Date() }
	});

	if (activeCcids.length === 0) {
		return { cliniques: [] };
	}

	const objectIds = activeCcids
		.filter((id): id is string => typeof id === 'string' && ObjectId.isValid(id))
		.map((id) => new ObjectId(id));

	const cliniques = await accountsColl
		.find(
			{ _id: { $in: objectIds }, type: 'clinic' },
			{
				projection: {
					clinic_name: 1,
					clinic_spec: 1
				}
			}
		)
		.toArray();

	return {
		cliniques: cliniques.map((c) => {
			const clinic = c as unknown as ClinicInformation & { _id: ObjectId };
			return {
				ccid: clinic._id.toString(),
				name: clinic.clinic_name,
				spec: clinic.clinic_spec ?? null
			};
		})
	};
};

export const actions = {
	default: async (event) => {
		const usid = event.cookies.get("USID");
		const session = await grabSession(usid);
		if (!session || !session.verified) return fail(400, "Session invalide ou compte non vérifié!");
		const sessionId = (session as any)._id;
		const form = await event.request.formData();
		const ccid = form.get("ccid");
		if (!ccid) return fail(400, "Session invalide ou compte non vérifié!");
		const delRes = await appointmentsColl.deleteOne({ clientId: sessionId, ccid: ccid });
		return delRes.acknowledged ? { success: true } : fail(400, "Session invalide ou compte non vérifié!");
	}
} satisfies Actions;