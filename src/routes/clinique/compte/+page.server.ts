import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ObjectId } from 'mongodb';
import { appointmentsColl, accountsColl } from '$lib/mongodb';
import { grabSession } from '$lib/session';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await grabSession(cookies.get('USID'));
	if (!session || session.type != 'clinic') {
		cookies.delete('USID', { path: '/' });
		redirect(307, '/clinique/bonjour');
	}

	const ccid = (session as any)._id;

	const rawAppointments = await appointmentsColl
		.find({ ccid: ccid.toString() })
		.sort({ timestamp: 1 })
		.toArray();

	const clientIds = [
		...new Set(
			rawAppointments
				.map((a) => a.clientId)
				.filter((id): id is string => typeof id === 'string' && ObjectId.isValid(id))
		)
	].map((id) => new ObjectId(id));

	const patients = await accountsColl
		.find({ _id: { $in: clientIds } }, { projection: { reg_password: 0 } })
		.toArray();

	const patientMap = new Map(patients.map((p) => [p._id.toString(), p]));

	const appointments = rawAppointments.map((a) => {
		const patient = patientMap.get(String(a.clientId)) as any;
		return {
			id: a._id.toString(),
			name: patient?.clinic_name ?? patient?.name ?? 'Patient inconnu',
			number: patient?.phone ?? 0,
			datetime: new Date(a.timestamp).toISOString()
		};
	});

	return {
		...session,
		appointments
	};
};