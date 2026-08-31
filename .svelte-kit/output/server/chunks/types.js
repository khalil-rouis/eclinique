import { t as clinic_types } from "./lib.js";
import * as z from "zod/mini";
//#region src/lib/types.ts
var ClinicInformationSchema = z.object({
	clinic_name: z.string().check(z.minLength(6)).check(z.maxLength(32)).check(z.regex(/^[a-zA-ZÀ-ÿ\s]*$/)),
	doctor_name: z.string().check(z.minLength(6)).check(z.maxLength(64)).check(z.regex(/^[a-zA-ZÀ-ÿ\s]*$/)),
	clinic_spec: z.enum(clinic_types),
	reg_email: z.email(),
	reg_password: z.string().check(z.minLength(8)).check(z.maxLength(64)),
	phone: z.coerce.number().check(z.minimum(1e7)).check(z.maximum(99999999))
});
var PatientInformationSchema = z.object({
	full_name: z.string().check(z.minLength(6)).check(z.maxLength(64)).check(z.regex(/^[a-zA-ZÀ-ÿ\s]*$/)),
	reg_password: z.string().check(z.minLength(8)).check(z.maxLength(64)),
	phone: z.coerce.number().check(z.minimum(1e7)).check(z.maximum(99999999))
});
var LoginInformationSchema = z.object({
	phone_number: z.optional(z.coerce.number().check(z.minimum(1e7)).check(z.maximum(99999999))),
	email: z.optional(z.email()),
	password: z.string().check(z.minLength(8)).check(z.maxLength(64))
});
var PatientLoginInformationSchema = z.object({
	phone_number: z.optional(z.coerce.number().check(z.minimum(1e7)).check(z.maximum(99999999))),
	password: z.string().check(z.minLength(8)).check(z.maxLength(64))
});
//#endregion
export { PatientLoginInformationSchema as i, LoginInformationSchema as n, PatientInformationSchema as r, ClinicInformationSchema as t };
