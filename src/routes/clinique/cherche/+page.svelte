<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let query = $state(data.query);
	let selectedSpec = $state(data.selectedSpec);
	let debounceTimer: ReturnType<typeof setTimeout>;
	let showAuthPrompt = $state(false);

	function updateUrl() {
		const params = new URLSearchParams();
		if (query.trim()) params.set('q', query.trim());
		if (selectedSpec) params.set('spec', selectedSpec);
		goto(`?${params.toString()}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function onQueryInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(updateUrl, 300);
	}

	function onSpecChange() {
		updateUrl();
	}

	function clearFilters() {
		query = '';
		selectedSpec = '';
		updateUrl();
	}

	function handleClinicClick(ccid: string) {
		if (data.isAuthenticated) {
			goto(`/clinique/rendezvous?ccid=${ccid}`);
		} else {
			showAuthPrompt = true;
		}
	}
</script>

<svelte:head>
	<title>Trouver une clinique — eClinique</title>
</svelte:head>

<div class="min-h-screen bg-base-200 pb-16">
	<div class="mx-auto max-w-3xl px-4 py-10">
		<h1 class="font-display mb-1 text-3xl font-semibold">Trouver une clinique</h1>
		<p class="mb-8 text-sm text-base-content/60">
			Cherchez par nom de clinique, nom du médecin, ou filtrez par spécialité.
		</p>

		<div class="mb-8 flex flex-col gap-3 sm:flex-row">
			<label class="input-bordered input flex flex-1 items-center gap-2">
				<svg
					class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-base-content/40"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" />
					<path
						d="M20 20l-3.5-3.5"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
				<input
					type="text"
					placeholder="Nom de la clinique ou du médecin"
					class="input-bordered input w-full pl-9"
					style="color: hsl(var(--bc)); background-color: hsl(var(--b1)); caret-color: hsl(var(--bc));"
					bind:value={query}
					oninput={onQueryInput}
				/>
			</label>

			<select
				class="select-bordered select w-full sm:w-56"
				bind:value={selectedSpec}
				onchange={onSpecChange}
			>
				<option value="">Toutes les spécialités</option>
				{#each data.specialties as spec}
					<option value={spec}>{spec}</option>
				{/each}
			</select>
		</div>

		{#if query || selectedSpec}
			<button type="button" class="btn -mt-4 mb-6 btn-ghost btn-xs" onclick={clearFilters}>
				Effacer les filtres
			</button>
		{/if}

		{#if data.clinics.length === 0}
			<div
				class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-base-content/15 bg-base-100 px-4 py-16 text-center"
			>
				<p class="text-sm text-base-content/60">Aucune clinique ne correspond à votre recherche</p>
			</div>
		{:else}
			<!-- result cards: swap <a href> for a button -->
			<div class="grid gap-4 sm:grid-cols-2">
				{#each data.clinics as clinic (clinic.ccid)}
					<button
						type="button"
						onclick={() => handleClinicClick(clinic.ccid)}
						class="group flex flex-col overflow-hidden rounded-2xl bg-base-100 text-left shadow-sm ring-1 ring-base-content/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30"
					>
						<!-- Cover photo -->
						<div class="relative aspect-[16/7] w-full shrink-0 overflow-hidden bg-base-200">
							{#if clinic.cover_photo_url}
								<img
									src={clinic.cover_photo_url}
									alt=""
									loading="lazy"
									class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary/30"
								>
									<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<rect
											x="3"
											y="4"
											width="18"
											height="16"
											rx="2"
											stroke="currentColor"
											stroke-width="1.6"
										/>
										<path
											d="M3 16l5-5 4 4 3-3 6 6"
											stroke="currentColor"
											stroke-width="1.6"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<circle cx="8" cy="9" r="1.3" stroke="currentColor" stroke-width="1.3" />
									</svg>
								</div>
							{/if}
						</div>

						<div class="flex flex-1 flex-col justify-between p-5">
							<div>
								<h2 class="mr-2 inline text-base leading-snug font-semibold">{clinic.name}</h2>
								{#if clinic.spec}
									<span
										class="badge inline badge-sm opacity-80 transition badge-primary group-hover:opacity-100"
									>
										{clinic.spec}
									</span>
								{/if}
								{#if clinic.doctorName}
									<p class="mt-0.5 text-xs text-base-content/50">Dr. {clinic.doctorName}</p>
								{/if}
								{#if clinic.address}
									<p class="mt-0.5 text-xs text-base-content">📍 {clinic.address}</p>
								{/if}
							</div>

							<div class="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
								Prendre rendez-vous
								<span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true"
									>→</span
								>
							</div>
						</div>
					</button>
				{/each}
			</div>

			<!-- AUTH PROMPT MODAL -->
			<dialog class="modal" class:modal-open={showAuthPrompt}>
				<div class="modal-box max-w-sm">
					<h3 class="mb-1 text-lg font-semibold">Connexion requise</h3>
					<p class="mb-6 text-sm text-base-content/60">
						Connectez-vous à votre espace patient pour prendre rendez-vous.
					</p>
					<div class="modal-action">
						<button class="btn btn-ghost" onclick={() => (showAuthPrompt = false)}>Annuler</button>
						<a href="/patient/bonjour" class="btn btn-primary">Se connecter</a>
					</div>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button onclick={() => (showAuthPrompt = false)}>close</button>
				</form>
			</dialog>
		{/if}
	</div>
</div>
