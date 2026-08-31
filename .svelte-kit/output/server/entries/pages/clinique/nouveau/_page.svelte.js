import { r as ensure_array_like, t as attr_class, v as attr, y as escape_html } from "../../../../chunks/server.js";
import { t as clinic_types } from "../../../../chunks/lib.js";
import "../../../../chunks/navigation.js";
//#region src/routes/clinique/nouveau/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let clinic_information = {
			clinic_name: "",
			doctor_name: "",
			clinic_spec: clinic_types[0],
			reg_email: "",
			reg_password: "",
			phone: ""
		};
		let erroneousFields = [];
		$$renderer.push(`<div class="hero min-h-screen" style="background: url('../bg.svg');"><div class="hero-content flex-col gap-5"><div class="text-center lg:text-left"><h1 class="text-3xl font-bold drop-shadow-xl sm:text-5xl">Inscription du clinique</h1></div> <div class="card shrink-0 overflow-clip border-2 border-gray-700 bg-base-100 shadow-2xl"><img src="../loading.svg" class="absolute inset-0 m-auto w-30 animate-spin place-self-center self-center justify-self-center opacity-0 invert transition-opacity" style="animation-duration: 3s;" alt=""/> <div class="card-body transition-opacity sm:flex-row"><fieldset class="fieldset flex flex-col gap-3"><div class="flex flex-col gap-1"><label class="fieldset-label" for="clinic_name">Nom du clinique</label> <input id="clinic_name"${attr_class(`input w-full min-w-xs outline-none ${erroneousFields.indexOf("clinic_name") != -1 || erroneousFields[0] == "*" ? "border-red-700" : ""}`)} type="text" placeholder="Au moins 6 caractères"${attr("value", clinic_information.clinic_name)}/></div> <div class="flex flex-col gap-1"><label class="fieldset-label" for="doctor_name">Nom du docteur</label> <input id="doctor_name"${attr_class(`input w-full outline-none ${erroneousFields.indexOf("doctor_name") != -1 || erroneousFields[0] == "*" ? "border-red-700" : ""}`)} type="text" placeholder="Au moins 6 caractères"${attr("value", clinic_information.doctor_name)}/></div> <div class="flex flex-col gap-1"><label class="fieldset-label" for="clinic_spec">Spécialité du clinique</label> `);
		$$renderer.select({
			name: "clinic_spec",
			id: "clinic_spec",
			class: `select outline-none ${erroneousFields.indexOf("clinic_spec") != -1 || erroneousFields[0] == "*" ? "border-red-700" : ""}`,
			value: clinic_information.clinic_spec
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(clinic_types);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let type = each_array[$$index];
				$$renderer.option({ value: type }, ($$renderer) => {
					$$renderer.push(`${escape_html(type)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div></fieldset> <div class="divider hidden divider-horizontal sm:flex"></div> <fieldset class="fieldset flex flex-col gap-3"><div class="flex flex-col gap-1"><label class="fieldset-label" for="reg_email">Email</label> <input id="reg_email"${attr_class(`input w-full min-w-xs outline-none ${erroneousFields.indexOf("reg_email") != -1 || erroneousFields[0] == "*" ? "border-red-700" : ""}`)} type="email" placeholder="example@gmail.com"${attr("value", clinic_information.reg_email)}/></div> <div class="flex flex-col gap-1"><label class="fieldset-label" for="reg_password">Mot de passe</label> <input id="reg_password"${attr_class(`input w-full outline-none ${erroneousFields.indexOf("reg_password") != -1 || erroneousFields[0] == "*" ? "border-red-700" : ""}`)} type="password" placeholder="Au moins 8 caractères"${attr("value", clinic_information.reg_password)}/></div> <div class="flex flex-col gap-1"><label class="fieldset-label" for="phone">Numéro du telephone</label> <div class="flex w-full items-center gap-4"><p class="pointer-events-none fieldset-label text-lg select-none">+216</p> <input id="phone"${attr_class(`input outline-none ${erroneousFields.indexOf("phone") != -1 || erroneousFields[0] == "*" ? "border-red-700" : ""}`)} type="text" placeholder="94123456"${attr("value", clinic_information.phone)}/></div></div></fieldset></div> <button class="btn mr-4 mb-4 ml-auto flex w-11/12 btn-neutral sm:w-max"><img src="../arrow.svg" class="h-3 w-3 rotate-180 invert" alt=""/> Vérification du numéro de
				téléphone</button></div></div></div>`);
	});
}
//#endregion
export { _page as default };
