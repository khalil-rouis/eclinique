import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { grabSession } from '$lib/session';
import { accountsColl } from '$lib/mongodb';
import { ObjectId } from 'mongodb';


const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const MAGIC_BYTES: { mime: string; signature: number[]; offset?: number }[] = [
	{ mime: 'image/jpeg', signature: [0xff, 0xd8, 0xff] },
	{ mime: 'image/png', signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
	{ mime: 'image/gif', signature: [0x47, 0x49, 0x46, 0x38] },
	{ mime: 'image/webp', signature: [0x57, 0x45, 0x42, 0x50], offset: 8 }
];

function matchesKnownImageSignature(bytes: Uint8Array): boolean {
	return MAGIC_BYTES.some(({ signature, offset = 0 }) =>
		signature.every((byte, i) => bytes[offset + i] === byte)
	);
}

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	// TODO: authentication / authorization
	// Verify the caller is logged in as a clinic and resolve `clinicId`
	// from `locals` (or a session cookie / JWT). Throw `error(401, ...)`
	// if there's no valid session, and `error(403, ...)` if the session
	// doesn't belong to a clinic account.

    const sessId = cookies.get("USID");
    const session = await grabSession(sessId);
    if (!session || !session.verified || session.type != "clinic") {
		throw error(401, 'Non authentifié.');
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		throw error(400, 'Requête invalide.');
	}

	const file = formData.get('cover_photo');

	if (!(file instanceof File)) {
		throw error(400, 'Aucun fichier reçu.');
	}

	if (file.size === 0) {
		throw error(400, 'Le fichier est vide.');
	}

	if (file.size > MAX_FILE_SIZE) {
		throw error(413, "L'image ne doit pas dépasser 8 Mo.");
	}

	if (!ALLOWED_MIME_TYPES.has(file.type)) {
		throw error(415, 'Seules les images JPEG, PNG, WEBP ou GIF sont acceptées.');
	}

	const headerBuffer = new Uint8Array(await file.slice(0, 16).arrayBuffer());

	if (!matchesKnownImageSignature(headerBuffer)) {
		throw error(415, "Le fichier ne semble pas être une image valide.");
	}

	const arrayBuffer = await file.arrayBuffer();
	const bytes = new Uint8Array(arrayBuffer);

	const coverPhotoUrl = await saveCoverPhoto((session as any)._id, bytes, file.type);

	// TODO: database
	// Persist `coverPhotoUrl` on the clinic record, e.g.:
	await accountsColl.updateOne(
        { _id: new ObjectId((session as any)._id) },
        { $set: { cover_photo_url: coverPhotoUrl } }
    );

	return json({ cover_photo_url: coverPhotoUrl });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	const sessId = cookies.get("USID");
    const session = await grabSession(sessId);
    if (!session || !session.verified || session.type != "clinic") {
		throw error(401, 'Non authentifié.');
	}
    const clinicId = (session as any)._id;

	await deleteCoverPhoto(clinicId);

	await accountsColl.updateOne(
        { _id: new ObjectId(clinicId) },
        { $unset: { cover_photo_url: '' } }
    );

	return json({ success: true });
};

async function saveCoverPhoto(clinicId: string, bytes: Uint8Array, mimeType: string): Promise<string> {
	return "";
}

async function deleteCoverPhoto(clinicId: string): Promise<void> {
	//throw new Error('deleteCoverPhoto() is not implemented yet.');
    
}