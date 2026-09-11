import type { PageServerLoad } from './$types';
import { accountsColl } from '$lib/mongodb';
import { grabSession } from '$lib/session';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const spec = url.searchParams.get('spec')?.trim() ?? '';

	const filter: Record<string, unknown> = { type: 'clinic', verified: true };

	if (q) {
		const pattern = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		filter.$or = [
			{ clinic_name: { $regex: pattern, $options: 'i' } },
			{ doctor_name: { $regex: pattern, $options: 'i' } }
		];
	}

	if (spec) {
		filter.clinic_spec = spec;
	}

	const [results, specialties, session] = await Promise.all([
		accountsColl
			.find(filter, { projection: { clinic_name: 1, clinic_spec: 1, doctor_name: 1 } })
			.sort({ clinic_name: 1 })
			.toArray(),
		accountsColl.distinct('clinic_spec', { type: 'clinic', verified: true }),
		grabSession(cookies.get('USID'))
	]);

	const isAuthenticated = !!(session && session.verified);

	return {
		clinics: results.map((c) => ({
			ccid: c._id.toString(),
			name: (c as any).clinic_name,
			spec: (c as any).clinic_spec,
			doctorName: (c as any).doctor_name
		})),
		specialties: specialties.filter(Boolean).sort(),
		query: q,
		selectedSpec: spec,
		isAuthenticated
	};
};