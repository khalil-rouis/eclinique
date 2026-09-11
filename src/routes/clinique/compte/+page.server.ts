import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ObjectId } from 'mongodb';
import { appointmentsColl, accountsColl, paymentsColl } from '$lib/mongodb';
import { grabSession } from '$lib/session';
import type { ClinicInformation, SubscriptionPayment } from '$lib/types';
import { initKonnectPayment } from '$lib/konnect';

export const load: PageServerLoad = async ({ cookies, url, fetch }) => {
	const session = await grabSession(cookies.get('USID'));
	if (!session || session.type != 'clinic') {
		cookies.delete('USID', { path: '/' });
		redirect(307, '/clinique/bonjour');
	}

	const ccid = (session as any)._id;
	const paymentId = url.searchParams.get("paymentId");

	const subscription_payments:SubscriptionPayment[] = await paymentsColl
		.find({ clinic_id: ccid.toString() })
		.sort({ created_at: -1 })
		.toArray();

	if (paymentId) {
		const payment:SubscriptionPayment | undefined = subscription_payments.find(p => p._id?.toString() == paymentId);
		if (payment && payment.status == "pending") {
			const initPaymentKonnect = await initKonnectPayment(
				(session as ClinicInformation).reg_email, (session as ClinicInformation).phone, 
				(session as ClinicInformation).doctor_name, paymentId, payment.amount);
			if (!initPaymentKonnect) return { isPayment: false };
			const jsonRes = await initPaymentKonnect.json();
			return { isPayment: true, ...jsonRes };
		}
	}

	subscription_payments.forEach(x => x._id = undefined);

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
			name: patient?.full_name ?? patient?.doctor_name ?? 'Patient inconnu',
			number: patient?.phone ?? 0,
			datetime: new Date(a.timestamp).toISOString()
		};
	});
	
	return { ...session, appointments, subscription_payments };
};