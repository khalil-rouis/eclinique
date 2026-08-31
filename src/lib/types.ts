import { clinic_types } from "$lib";
import * as z from "zod/mini";

export type PatientInformation = {
    full_name: string;
    reg_password: string;
    phone: string;
}

export type ClinicInformation = {
    clinic_name: string;
    doctor_name: string;
    clinic_spec: string;
    reg_email: string;
    reg_password: string;
    phone: string;
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
    id: number;
    name: string;
    number: number;
    datetime: string;
};

export const ClinicInformationSchema = z.object(
    {
        clinic_name: z.string().check(z.minLength(6)).check(z.maxLength(32)).check(z.regex(/^[a-zA-ZÀ-ÿ\s]*$/)),
        doctor_name: z.string().check(z.minLength(6)).check(z.maxLength(64)).check(z.regex(/^[a-zA-ZÀ-ÿ\s]*$/)),
        clinic_spec: z.enum(clinic_types),
        reg_email: z.email(),
        reg_password: z.string().check(z.minLength(8)).check(z.maxLength(64)),
        phone: z.coerce.number().check(z.minimum(10000000)).check(z.maximum(99999999))
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