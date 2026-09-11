import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { grabSession } from '$lib/session';
import { clinic_address_crit, clinic_name_crit, clinic_phone_crit, clinic_spec_crit, doctor_name_crit } from '$lib/types';
import { accountsColl } from '$lib/mongodb';
import { ObjectId } from 'mongodb';


export const PATCH: RequestHandler = async ({ request, cookies }) => {
    const body = await request.json();

    const {
        clinic_name,
        clinic_phone,
        clinic_spec,
        doctor_name,
        clinic_address
    } = body;

    const session = await grabSession(cookies.get('USID'));
    
	if (!session || session.type != 'clinic') {
		cookies.delete('USID', { path: '/' });
		throw error(401, "Bad session!");
	}

    // Basic validation
    if (
        typeof clinic_name !== 'string' || typeof clinic_phone !== 'string' ||
        typeof clinic_spec !== 'string' || typeof doctor_name !== 'string' || typeof clinic_address !== 'string'
    ) {
        throw error(400, 'Données invalides.');
    }

    const clinicName = clinic_name.trim();
    const clinicPhone = clinic_phone.trim();
    const clinicSpec = clinic_spec.trim();
    const clinicAddress = clinic_address.trim();
    const doctorName = doctor_name.trim();

    if (!clinicName || !clinic_name_crit.safeParse(clinic_name).success) {
        throw error(400, 'Le nom de la clinique est invalide.');
    }

    if (!clinicPhone || !clinic_phone_crit.safeParse(clinic_phone).success) {
        throw error(400, 'Numéro de téléphone invalide.');
    }

    if (!clinicSpec || !clinic_spec_crit.safeParse(clinic_spec).success) {
        throw error(400, 'La spécialité est invalide.');
    }

    if (!clinicAddress || !clinic_address_crit.safeParse(clinic_address).success) {
        throw error(400, "Adresse invalide.");
    }

    if (!doctorName || !doctor_name_crit.safeParse(doctor_name).success) {
        throw error(400, "Le nom du docteur est invalide.");
    }
    
    const updateResult = await accountsColl.updateOne(
        { _id: new ObjectId((session as any)._id) },
        {
            $set: {
                clinic_name: clinicName,
                doctor_name: doctorName,
                phone: clinicPhone,
                clinic_spec: clinicSpec,
                clinic_address: clinicAddress,
                updated_at: new Date()
            }
        }
    );

    return json({
        success: updateResult.acknowledged,
        clinic: {
            name: clinicName,
            phone: clinicPhone,
            speciality: clinicSpec,
            address: clinicAddress
        }
    });
};