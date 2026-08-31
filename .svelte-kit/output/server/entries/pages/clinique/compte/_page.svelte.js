import { n as derived, o as stringify, r as ensure_array_like, t as attr_class, v as attr, y as escape_html } from "../../../../chunks/server.js";
//#region src/lib/components/AppointmentCard.svelte
function AppointmentCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id, name, number, date, datetime, accentClass = "bg-primary", dragging = false, onReschedule, onCancel } = $$props;
		let draftDatetime = datetime;
		$$renderer.push(`<div${attr_class("card-compact card w-full border border-base-300 bg-base-100 shadow-sm transition-shadow duration-150 sm:w-64", void 0, { "shadow-lg": dragging })}><div class="relative flex items-center gap-3 rounded-box p-4"><div${attr_class(`absolute top-0 bottom-0 left-0 w-1.5 ${stringify(accentClass)}`)}></div> <div class="min-w-0 flex-1 pl-1.5"><span class="block text-[10px] tracking-wider text-base-content/50 uppercase">Rendez-vous</span> <h3 class="truncate text-base font-semibold text-base-content sm:text-sm">${escape_html(name)}</h3> <div class="mt-0.5 flex items-center gap-1.5 text-sm text-base-content/60 sm:text-xs"><span>${escape_html(date)}</span> <span class="text-base-content/30">•</span> <span>N° ${escape_html(number)}</span></div></div> <div class="dropdown dropdown-end shrink-0"><div tabindex="0" role="button" class="btn btn-square btn-ghost btn-sm"${attr("aria-label", `Options pour le rendez-vous de ${name}`)}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg></div> <ul class="menu dropdown-content z-20 w-44 menu-sm rounded-box border border-base-300 bg-base-100 p-2 shadow-md"><li><button type="button">Modifier l'heure</button></li> <li><button type="button" class="text-error">Annuler le rendez-vous</button></li></ul></div></div></div> <dialog class="modal"><div class="modal-box max-w-sm"><h3 class="text-base font-semibold">Modifier l'heure de ${escape_html(name)}</h3> <p class="mt-1 text-xs text-base-content/50">Rendez-vous n° ${escape_html(number)}</p> <div class="form-control mt-4"><label class="label"${attr("for", `reschedule-${id}`)}><span class="label-text">Nouvelle date et heure</span></label> <input${attr("id", `reschedule-${id}`)} type="datetime-local" class="input-bordered input w-full"${attr("value", draftDatetime)}/></div> <div class="modal-action"><form method="dialog" class="flex gap-2"><button type="button" class="btn btn-ghost">Annuler</button> <button type="button" class="btn btn-primary">Enregistrer</button></form></div></div> <form method="dialog" class="modal-backdrop"><button>fermer</button></form></dialog>`);
	});
}
//#endregion
//#region src/lib/components/AppointmentBoard.svelte
function AppointmentBoard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let appointments = [
			{
				id: 1,
				name: "Sara Ben Ali",
				number: 1042,
				datetime: "2026-08-29T10:00:00"
			},
			{
				id: 2,
				name: "Omar Trabelsi",
				number: 1043,
				datetime: "2026-08-29T14:30:00"
			},
			{
				id: 3,
				name: "Yasmine Karray",
				number: 1044,
				datetime: "2026-08-30T18:15:00"
			},
			{
				id: 4,
				name: "Karim Jendoubi",
				number: 1045,
				datetime: "2026-08-31T09:00:00"
			},
			{
				id: 5,
				name: "Leila Mansour",
				number: 1046,
				datetime: "2026-08-31T20:00:00"
			},
			{
				id: 6,
				name: "Ahmed Souissi",
				number: 1047,
				datetime: "2026-09-03T11:00:00"
			}
		];
		const rowDefs = [
			{
				id: "morning",
				label: "Matin",
				starts: 5,
				ends: 12,
				header: "text-amber-600",
				accent: "bg-amber-500"
			},
			{
				id: "afternoon",
				label: "Après-midi",
				starts: 12,
				ends: 17,
				header: "text-sky-600",
				accent: "bg-sky-500"
			},
			{
				id: "evening",
				label: "Soir",
				starts: 17,
				ends: 24,
				header: "text-violet-600",
				accent: "bg-violet-500"
			},
			{
				id: "night",
				label: "Nuit",
				starts: 0,
				ends: 5,
				header: "text-slate-600",
				accent: "bg-slate-500"
			}
		];
		const dayThemes = [
			{
				border: "border-primary/30",
				bg: "bg-primary/5",
				badge: "bg-primary text-primary-content"
			},
			{
				border: "border-secondary/30",
				bg: "bg-secondary/5",
				badge: "bg-secondary text-secondary-content"
			},
			{
				border: "border-accent/30",
				bg: "bg-accent/5",
				badge: "bg-accent text-accent-content"
			},
			{
				border: "border-info/30",
				bg: "bg-info/5",
				badge: "bg-info text-info-content"
			}
		];
		let saveStatus = "idle";
		function timeBucketFor(appt) {
			const hour = new Date(appt.datetime).getHours();
			return rowDefs.find((r) => hour >= r.starts && hour < r.ends) ?? rowDefs[0];
		}
		function startOfDay(d) {
			return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
		}
		function dayKeyFor(appt) {
			return startOfDay(new Date(appt.datetime));
		}
		function dayLabelFor(dayKey) {
			const date = new Date(dayKey);
			const today = startOfDay(/* @__PURE__ */ new Date());
			const oneDay = 864e5;
			if (dayKey === today) return "Aujourd'hui";
			if (dayKey === today + oneDay) return "Demain";
			if (dayKey === today - oneDay) return "Hier";
			return date.toLocaleDateString("fr-FR", {
				day: "numeric",
				month: "short"
			});
		}
		function formatTime(iso) {
			return new Date(iso).toLocaleString("fr-FR", {
				hour: "numeric",
				minute: "2-digit"
			});
		}
		const sortedAppointments = derived(() => [...appointments].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
		const dayGroups = derived(() => {
			const dayMap = /* @__PURE__ */ new Map();
			for (const appt of sortedAppointments()) {
				const key = dayKeyFor(appt);
				if (!dayMap.has(key)) dayMap.set(key, []);
				dayMap.get(key).push(appt);
			}
			return [...dayMap.entries()].sort(([a], [b]) => a - b).map(([dayKey, dayAppointments], index) => ({
				dayKey,
				label: dayLabelFor(dayKey),
				theme: dayThemes[index % dayThemes.length],
				rows: rowDefs.map((row) => ({
					...row,
					appointments: dayAppointments.filter((a) => timeBucketFor(a).id === row.id)
				})).filter((row) => row.appointments.length > 0)
			}));
		});
		async function handleReschedule(id, newDatetime) {
			const appt = appointments.find((a) => a.id === id);
			if (!appt) return;
			const previous = appt.datetime;
			appt.datetime = newDatetime;
			saveStatus = "saving";
			try {
				if (!(await fetch(`/api/appointments/${id}/reschedule`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ datetime: newDatetime })
				})).ok) throw new Error("Échec de la reprogrammation");
				saveStatus = "saved";
			} catch (err) {
				console.error(err);
				appt.datetime = previous;
				saveStatus = "error";
			} finally {
				setTimeout(() => saveStatus = "idle", 1500);
			}
		}
		async function handleCancelAppointment(id) {
			const index = appointments.findIndex((a) => a.id === id);
			if (index === -1) return;
			const [removed] = appointments.splice(index, 1);
			appointments = [...appointments];
			saveStatus = "saving";
			try {
				if (!(await fetch(`/api/appointments/${id}`, { method: "DELETE" })).ok) throw new Error("Échec de l'annulation");
				saveStatus = "saved";
			} catch (err) {
				console.error(err);
				appointments = [...appointments, removed];
				saveStatus = "error";
			} finally {
				setTimeout(() => saveStatus = "idle", 1500);
			}
		}
		$$renderer.push(`<div class="h-full w-full overflow-y-auto">`);
		if (saveStatus !== "idle") $$renderer.push(`<!--[0--><div class="toast toast-end toast-bottom z-50"><div${attr_class("alert", void 0, {
			"alert-info": saveStatus === "saving",
			"alert-success": saveStatus === "saved",
			"alert-error": saveStatus === "error"
		})}><span class="text-sm">${escape_html(saveStatus === "saving" ? "Enregistrement…" : saveStatus === "saved" ? "Enregistré" : "Échec de l'enregistrement")}</span></div></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex flex-col items-start gap-4 p-0 sm:p-6 md:flex-row md:flex-wrap"><!--[-->`);
		const each_array = ensure_array_like(dayGroups());
		for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
			let day = each_array[$$index_2];
			$$renderer.push(`<section${attr_class(`w-full border-2 border-r-0 border-l-0 sm:border-2 md:w-80 md:shrink-0 ${stringify(day.theme.border)} ${stringify(day.theme.bg)} px-3 py-3 sm:px-4 sm:py-4`)}><h1 class="mb-3 flex items-baseline gap-2 text-lg font-bold text-base-content sm:text-xl"><span${attr_class(`rounded-full px-2 py-0.5 text-sm font-semibold ${stringify(day.theme.badge)}`)}>${escape_html(day.label)}</span> <span class="text-xs font-normal text-base-content/50">${escape_html(new Date(day.dayKey).toLocaleDateString("fr-FR", {
				weekday: "long",
				day: "numeric",
				month: "long"
			}))}</span></h1> <div class="flex flex-col gap-4"><!--[-->`);
			const each_array_1 = ensure_array_like(day.rows);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let row = each_array_1[$$index_1];
				$$renderer.push(`<div class="rounded-xl bg-base-100/70 p-3 sm:p-4"><h2${attr_class(`mb-3 text-xs font-bold tracking-wide uppercase ${stringify(row.header)}`)}>${escape_html(row.label)}</h2> <div class="flex flex-col gap-3" role="list"${attr("aria-label", `Rendez-vous du ${day.label.toLowerCase()}, ${row.label.toLowerCase()}`)}><!--[-->`);
				const each_array_2 = ensure_array_like(row.appointments);
				for (let $$index = 0, $$length = each_array_2.length; $$index < $$length; $$index++) {
					let appt = each_array_2[$$index];
					AppointmentCard($$renderer, {
						id: appt.id,
						name: appt.name,
						number: appt.number,
						date: formatTime(appt.datetime),
						datetime: appt.datetime,
						accentClass: row.accent,
						onReschedule: handleReschedule,
						onCancel: handleCancelAppointment
					});
				}
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		}
		$$renderer.push(`<!--]--> `);
		if (appointments.length === 0) $$renderer.push(`<!--[0--><p class="w-full py-2 text-center text-sm text-base-content/40 italic">Aucun rendez-vous</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region src/routes/clinique/compte/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<header class="flex items-stretch overflow-hidden border border-base-300 bg-base-100 shadow-sm"><div class="w-1.5 shrink-0 bg-primary" aria-hidden="true"></div> <div class="flex flex-1 flex-col gap-3 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:p-4"><div class="flex min-w-0 flex-col gap-1.5"><div class="flex flex-wrap items-baseline gap-2"><h1 class="truncate text-base font-bold text-base-content sm:text-lg">${escape_html(data.clinic_name)}</h1> <span class="badge rounded-none badge-outline badge-sm font-semibold tracking-wide uppercase badge-primary">${escape_html(data.clinic_spec)}</span></div> <div class="flex items-center gap-1.5 text-sm text-base-content/70"><svg class="h-4 w-4 shrink-0 text-base-content/50" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.6"></path><path d="M4.5 20c1.2-3.8 4.2-6 7.5-6s6.3 2.2 7.5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg> <span class="truncate font-medium">Dr. ${escape_html(data.doctor_name)}</span></div></div> <div class="flex flex-wrap items-center gap-2 sm:gap-3">`);
		if (!data.isVerified) $$renderer.push(`<!--[0--><div class="badge shrink-0 gap-1.5 badge-outline px-3 py-3 text-xs font-semibold badge-warning sm:text-sm"><svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"></circle><path d="M12 7.5v5.2l3.2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg> <span class="whitespace-nowrap">Téléphone non vérifié</span></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <a href="/clinique/aurevoire" class="badge shrink-0 rounded-none badge-outline px-3 py-3 text-xs opacity-75 badge-error hover:badge-secondary active:bg-secondary active:text-secondary-content sm:text-sm">Déconnexion</a></div></div></header> <main>`);
		if (!data.isVerified) $$renderer.push(`<!--[0--><img src="../unverified.svg" alt="" class="absolute inset-0 top-0 bottom-0 m-auto h-48 w-48 opacity-40 invert md:h-72 md:w-72"/>`);
		else {
			$$renderer.push("<!--[-1-->");
			AppointmentBoard($$renderer, {});
		}
		$$renderer.push(`<!--]--></main>`);
	});
}
//#endregion
export { _page as default };
