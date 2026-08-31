<script lang="ts">
	import AppointmentCard from './AppointmentCard.svelte';
	import type { Appointment } from '$lib/types';
	let appointments = $state<Appointment[]>([
		{ id: 1, name: 'Sara Ben Ali', number: 1042, datetime: '2026-08-29T10:00:00' },
		{ id: 2, name: 'Omar Trabelsi', number: 1043, datetime: '2026-08-29T14:30:00' },
		{ id: 3, name: 'Yasmine Karray', number: 1044, datetime: '2026-08-30T18:15:00' },
		{ id: 4, name: 'Karim Jendoubi', number: 1045, datetime: '2026-08-31T09:00:00' },
		{ id: 5, name: 'Leila Mansour', number: 1046, datetime: '2026-08-31T20:00:00' },
		{ id: 6, name: 'Ahmed Souissi', number: 1047, datetime: '2026-09-03T11:00:00' }
	]);

	const rowDefs = [
		{
			id: 'morning',
			label: 'Matin',
			starts: 5,
			ends: 12,
			header: 'text-amber-600',
			accent: 'bg-amber-500'
		},
		{
			id: 'afternoon',
			label: 'Après-midi',
			starts: 12,
			ends: 17,
			header: 'text-sky-600',
			accent: 'bg-sky-500'
		},
		{
			id: 'evening',
			label: 'Soir',
			starts: 17,
			ends: 24,
			header: 'text-violet-600',
			accent: 'bg-violet-500'
		},
		{
			id: 'night',
			label: 'Nuit',
			starts: 0,
			ends: 5,
			header: 'text-slate-600',
			accent: 'bg-slate-500'
		}
	];

	const dayThemes = [
		{ border: 'border-primary/30', bg: 'bg-primary/5', badge: 'bg-primary text-primary-content' },
		{
			border: 'border-secondary/30',
			bg: 'bg-secondary/5',
			badge: 'bg-secondary text-secondary-content'
		},
		{ border: 'border-accent/30', bg: 'bg-accent/5', badge: 'bg-accent text-accent-content' },
		{ border: 'border-info/30', bg: 'bg-info/5', badge: 'bg-info text-info-content' }
	];

	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

	function timeBucketFor(appt: Appointment) {
		const hour = new Date(appt.datetime).getHours();
		return rowDefs.find((r) => hour >= r.starts && hour < r.ends) ?? rowDefs[0];
	}

	function startOfDay(d: Date) {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	}

	function dayKeyFor(appt: Appointment) {
		return startOfDay(new Date(appt.datetime));
	}

	function dayLabelFor(dayKey: number) {
		const date = new Date(dayKey);
		const today = startOfDay(new Date());
		const oneDay = 24 * 60 * 60 * 1000;

		if (dayKey === today) return "Aujourd'hui";
		if (dayKey === today + oneDay) return 'Demain';
		if (dayKey === today - oneDay) return 'Hier';

		return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
	}

	function formatTime(iso: string) {
		return new Date(iso).toLocaleString('fr-FR', { hour: 'numeric', minute: '2-digit' });
	}

	const sortedAppointments = $derived(
		[...appointments].sort(
			(a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
		)
	);

	const dayGroups = $derived.by(() => {
		const dayMap = new Map<number, Appointment[]>();

		for (const appt of sortedAppointments) {
			const key = dayKeyFor(appt);
			if (!dayMap.has(key)) dayMap.set(key, []);
			dayMap.get(key)!.push(appt);
		}

		return [...dayMap.entries()]
			.sort(([a], [b]) => a - b)
			.map(([dayKey, dayAppointments], index) => ({
				dayKey,
				label: dayLabelFor(dayKey),
				theme: dayThemes[index % dayThemes.length],
				rows: rowDefs
					.map((row) => ({
						...row,
						appointments: dayAppointments.filter((a) => timeBucketFor(a).id === row.id)
					}))
					.filter((row) => row.appointments.length > 0)
			}));
	});

	async function handleReschedule(id: number, newDatetime: string) {
		const appt = appointments.find((a) => a.id === id);
		if (!appt) return;
		const previous = appt.datetime;
		appt.datetime = newDatetime; // mise à jour optimiste

		saveStatus = 'saving';
		try {
			const res = await fetch(`/api/appointments/${id}/reschedule`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ datetime: newDatetime })
			});
			if (!res.ok) throw new Error('Échec de la reprogrammation');
			saveStatus = 'saved';
		} catch (err) {
			console.error(err);
			appt.datetime = previous; // retour en arrière
			saveStatus = 'error';
		} finally {
			setTimeout(() => (saveStatus = 'idle'), 1500);
		}
	}

	async function handleCancelAppointment(id: number) {
		const index = appointments.findIndex((a) => a.id === id);
		if (index === -1) return;
		const [removed] = appointments.splice(index, 1);
		appointments = [...appointments]; // déclenche la réactivité

		saveStatus = 'saving';
		try {
			const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error("Échec de l'annulation");
			saveStatus = 'saved';
		} catch (err) {
			console.error(err);
			appointments = [...appointments, removed]; // retour en arrière
			saveStatus = 'error';
		} finally {
			setTimeout(() => (saveStatus = 'idle'), 1500);
		}
	}
</script>

<div class="h-full w-full overflow-y-auto">
	{#if saveStatus !== 'idle'}
		<div class="toast toast-end toast-bottom z-50">
			<div
				class="alert"
				class:alert-info={saveStatus === 'saving'}
				class:alert-success={saveStatus === 'saved'}
				class:alert-error={saveStatus === 'error'}
			>
				<span class="text-sm">
					{saveStatus === 'saving'
						? 'Enregistrement…'
						: saveStatus === 'saved'
							? 'Enregistré'
							: "Échec de l'enregistrement"}
				</span>
			</div>
		</div>
	{/if}

	<div class="flex flex-col items-start gap-4 p-0 sm:p-6 md:flex-row md:flex-wrap">
		{#each dayGroups as day (day.dayKey)}
			<section
				class="w-full border-2 border-r-0 border-l-0 sm:border-2 md:w-80 md:shrink-0 {day.theme
					.border} {day.theme.bg} px-3 py-3 sm:px-4 sm:py-4"
			>
				<h1 class="mb-3 flex items-baseline gap-2 text-lg font-bold text-base-content sm:text-xl">
					<span class="rounded-full px-2 py-0.5 text-sm font-semibold {day.theme.badge}">
						{day.label}
					</span>
					<span class="text-xs font-normal text-base-content/50">
						{new Date(day.dayKey).toLocaleDateString('fr-FR', {
							weekday: 'long',
							day: 'numeric',
							month: 'long'
						})}
					</span>
				</h1>

				<div class="flex flex-col gap-4">
					{#each day.rows as row (row.id)}
						<div class="rounded-xl bg-base-100/70 p-3 sm:p-4">
							<h2 class="mb-3 text-xs font-bold tracking-wide uppercase {row.header}">
								{row.label}
							</h2>

							<div
								class="flex flex-col gap-3"
								role="list"
								aria-label={`Rendez-vous du ${day.label.toLowerCase()}, ${row.label.toLowerCase()}`}
							>
								{#each row.appointments as appt (appt.id)}
									<AppointmentCard
										id={appt.id}
										name={appt.name}
										number={appt.number}
										date={formatTime(appt.datetime)}
										datetime={appt.datetime}
										accentClass={row.accent}
										onReschedule={handleReschedule}
										onCancel={handleCancelAppointment}
									/>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/each}

		{#if appointments.length === 0}
			<p class="w-full py-2 text-center text-sm text-base-content/40 italic">Aucun rendez-vous</p>
		{/if}
	</div>
</div>
