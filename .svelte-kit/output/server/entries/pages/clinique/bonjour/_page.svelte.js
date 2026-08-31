import { b as escape_html, t as attr_class, y as attr } from "../../../../chunks/server.js";
import { t as page } from "../../../../chunks/state.js";
//#region src/routes/clinique/bonjour/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { phone, reg_email, reg_password } = page.state;
		let login_information = {
			email: reg_email,
			phone_number: phone,
			password: reg_password
		};
		let tab = reg_email ? 1 : phone ? 2 : 1;
		$$renderer.push(`<h1>${escape_html(phone)}</h1> <h1>${escape_html(reg_email)}</h1> <h2>${escape_html(reg_password)}</h2> <div class="hero min-h-screen" style="background: url('../bg.svg');"><div class="hero-content flex-col gap-5"><div class="text-center lg:text-left"><h1 class="text-3xl font-bold drop-shadow-xl sm:text-5xl">Se connecter</h1></div> <div class="card shrink-0 overflow-clip border-2 border-gray-700 bg-base-100 shadow-2xl"><img src="../loading.svg" class="absolute inset-0 m-auto w-30 animate-spin place-self-center self-center justify-self-center opacity-0 invert transition-opacity" style="animation-duration: 3s;" alt=""/> <div class="card-body transition-opacity sm:flex-row"><fieldset class="fieldset flex flex-col gap-3 transition-opacity"><div class="grid min-w-sm gap-2"><div role="tablist" class="tabs tabs-lift w-full"><button role="tab"${attr_class(`tab ${tab == 1 ? "tab-active" : ""}`)}>Email</button> <button role="tab"${attr_class(`tab ${tab == 2 ? "tab-active" : ""}`)}>Numéro du telephone</button></div> `);
		if (tab == 1) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col gap-1"><input id="email"${attr_class(`input w-full min-w-xs outline-none `)} type="email" placeholder="Saisissez votre adresse e-mail"${attr("value", login_information.email)}/></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (tab == 2) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col gap-1"><div class="flex w-full items-center gap-4"><p class="pointer-events-none fieldset-label text-lg select-none">+216</p> <input id="phone"${attr_class(`input outline-none `)} type="text" placeholder="Saisissez votre numéro du telephone"${attr("value", login_information.phone_number)}/></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex flex-col gap-1"><label class="fieldset-label" for="password">Mot de passe</label> <input id="password"${attr_class(`input w-full outline-none `)} type="password" placeholder="Saisissez votre mot de passe"${attr("value", login_information.password)}/></div></fieldset></div> <button class="btn mr-4 mb-4 ml-auto w-11/12 btn-neutral sm:w-max">Entrer</button></div></div></div>`);
	});
}
//#endregion
export { _page as default };
