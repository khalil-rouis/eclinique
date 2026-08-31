import { t as attr_class, v as attr } from "../../../../chunks/server.js";
import { t as page } from "../../../../chunks/state.js";
//#region src/routes/patient/bonjour/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { phone, reg_password } = page.state;
		let login_information = {
			phone_number: phone,
			password: reg_password
		};
		$$renderer.push(`<div class="hero min-h-screen" style="background: url('../bg.svg');"><div class="hero-content flex-col gap-5"><div class="text-center lg:text-left"><h1 class="text-3xl font-bold drop-shadow-xl sm:text-5xl">Se connecter</h1></div> <div class="card shrink-0 overflow-clip border-2 border-gray-700 bg-base-100 shadow-2xl"><img src="../loading.svg" class="absolute inset-0 m-auto w-30 animate-spin place-self-center self-center justify-self-center opacity-0 invert transition-opacity" style="animation-duration: 3s;" alt=""/> <div class="card-body transition-opacity sm:flex-row"><fieldset class="fieldset flex flex-col gap-3 transition-opacity"><div class="flex flex-col gap-1"><label class="fieldset-label" for="phone">Numéro du telephone</label> <div class="flex w-full items-center gap-4"><p class="pointer-events-none fieldset-label text-lg select-none">+216</p> <input id="phone"${attr_class(`input min-w-xs outline-none `)} type="text" placeholder="Saisissez votre numéro du telephone"${attr("value", login_information.phone_number)}/></div></div> <div class="flex flex-col gap-1"><label class="fieldset-label" for="password">Mot de passe</label> <input id="password"${attr_class(`input w-full outline-none `)} type="password" placeholder="Saisissez votre mot de passe"${attr("value", login_information.password)}/></div></fieldset></div> <button class="btn mr-4 mb-4 ml-auto w-11/12 btn-neutral sm:w-max">Entrer</button></div></div></div>`);
	});
}
//#endregion
export { _page as default };
