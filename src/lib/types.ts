import { clinic_types } from "$lib";
import type { ObjectId } from "mongodb";
import * as z from "zod/mini";

export type PatientInformation = {
    full_name: string;
    reg_password: string;
    phone: string;
    verified: boolean;
    type: string;
}

export type ClinicInformation = {
    clinic_name: string;
    clinic_address: string;
    doctor_name: string;
    clinic_spec: string;
    reg_email: string;
    reg_password: string;
    phone: string;
    verified: boolean;
    type: string;
};

export type LoginInformation = {
    phone_number?: string;
    email?: string;
    password: string;
};

export type PatientLoginInformation = {
    phone_number?: string;
    password: string;
}

export type Appointment = {
	id: string;
	name: string;
	number: number;
	datetime: string;
};

export type SubscriptionPayment = {
    _id: ObjectId | undefined;
    clinic_id: string;
    month: string;
    amount: number;
    status: 'paid' | 'pending';
    paid_at?: string | null;
    due_at?: string | null;
}

export const clinic_name_crit = z.string().check(z.minLength(6)).check(z.maxLength(32)).check(z.regex(/^[a-zA-ZÀ-ÿ\s]*$/));
export const clinic_address_crit = z.string().check(z.minLength(10)).check(z.maxLength(64));
export const doctor_name_crit = z.string().check(z.minLength(6)).check(z.maxLength(64)).check(z.regex(/^[a-zA-ZÀ-ÿ\s]*$/));
export const clinic_spec_crit = z.enum(clinic_types);
export const clinic_phone_crit = z.coerce.number().check(z.minimum(10000000)).check(z.maximum(99999999));
export const ClinicInformationSchema = z.object(
    {
        clinic_name: clinic_name_crit, clinic_address: clinic_address_crit, doctor_name: doctor_name_crit, clinic_spec: clinic_spec_crit,
        reg_email: z.email(),
        reg_password: z.string().check(z.minLength(8)).check(z.maxLength(64)),
        phone: clinic_phone_crit
    }
);

export const PatientInformationSchema = z.object(
    {
        full_name: z.string().check(z.minLength(6)).check(z.maxLength(64)).check(z.regex(/^[a-zA-ZÀ-ÿ\s]*$/)),
        reg_password: z.string().check(z.minLength(8)).check(z.maxLength(64)),
        phone: z.coerce.number().check(z.minimum(10000000)).check(z.maximum(99999999))
    }
)

export const LoginInformationSchema = z.object(
    {
        phone_number: z.optional(z.coerce.number().check(z.minimum(10000000)).check(z.maximum(99999999))),
        email: z.optional(z.email()),
        password: z.string().check(z.minLength(8)).check(z.maxLength(64))
    }
)

export const PatientLoginInformationSchema = z.object(
    {
        phone_number: z.optional(z.coerce.number().check(z.minimum(10000000)).check(z.maximum(99999999))),
        password: z.string().check(z.minLength(8)).check(z.maxLength(64))
    }
)

export interface AppointmentDoc {
	clientId: string;
	ccid: string;
	timestamp: Date;
}