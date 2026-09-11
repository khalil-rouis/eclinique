<script lang="ts">
	import { page } from '$app/stores';

	const { data } = $props();
	const ccid = $page.url.searchParams.get('ccid');

	type RendezVous = {
		timestamp: string;
	};

	let rendezvous = $state<RendezVous[]>([]);
	let loading = $state(true);
	let loadError = $state<string | null>(null);

	let showConfirm = $state(false);
	let submitting = $state(false);
	let notification = $state<{ type: 'success' | 'error'; message: string } | null>(null);

	async function loadHistoire() {
		loading = true;
		loadError = null;
		try {
			const res = await fetch(`/clinique/rendezvous/histoire?ccid=${ccid}`);
			if (!res.ok) throw new Error(`Erreur ${res.status}`);
			rendezvous = await res.json();
		} catch (e) {
			loadError = "Impossible de charger l'historique des rendez-vous.";
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadHistoire();
	});

	function formatDate(ts: string) {
		return new Date(ts).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatTime(ts: string) {
		return new Date(ts).toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function openConfirm() {
		showConfirm = true;
	}

	function cancelConfirm() {
		showConfirm = false;
	}

	async function confirmNewRendezVous() {
		submitting = true;
		try {
			const res = await fetch('/clinique/rendezvous/nouveau', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ccid })
			});

			if (!res.ok) throw new Error(`Erreur ${res.status}`);

			const created: RendezVous = await res.json();
			rendezvous = [...rendezvous, created];

			notification = {
				type: 'success',
				message: `Rendez-vous pris pour le ${formatDate(created.timestamp)} à ${formatTime(created.timestamp)}.`
			};
		} catch (e) {
			notification = {
				type: 'error',
				message: 'Échec de la prise de rendez-vous. Veuillez réessayer.'
			};
		} finally {
			submitting = false;
			showConfirm = false;
			setTimeout(() => (notification = null), 4000);
		}
	}

	let sortedRendezvous = $derived(
		[...rendezvous].sort((a, b) => {
			const now = Date.now();
			const diffA = Math.abs(new Date(a.timestamp).getTime() - now);
			const diffB = Math.abs(new Date(b.timestamp).getTime() - now);
			return diffA - diffB; // smallest distance from now first
		})
	);
</script>

{#if data.error}
	<div class="hero min-h-screen bg-base-200">
		<div class="hero-content text-center">
			<div>
				<h1 class="text-2xl font-bold text-error">ERROR: {data.error}</h1>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-base-200 pb-28">
		<!-- Header -->
		<div class="border-b border-base-content/10 bg-base-100">
			<div class="mx-auto max-w-2xl px-4 py-8 text-center sm:py-10">
				<p class="mb-1 text-sm font-medium text-base-content/60">Prendre un rendez-vous chez</p>
				<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{data.clinic_name}</h1>
				{#if data.clinic_spec}
					<p class="mt-1 text-sm text-base-content/60 italic">{data.clinic_spec}</p>
				{/if}
			</div>
		</div>

		<main class="mx-auto max-w-2xl px-4 pt-6">
			{#if notification}
				<div
					role="alert"
					class="alert {notification.type === 'success'
						? 'alert-success'
						: 'alert-error'} mb-4 shadow-sm"
				>
					<span class="text-sm">{notification.message}</span>
				</div>
			{/if}

			<h2 class="mb-3 px-1 text-base font-semibold text-base-content/80">
				Historique des rendez-vous
			</h2>

			{#if loading}
				<div class="flex flex-col items-center justify-center gap-3 py-16 text-base-content/50">
					<span class="loading loading-md loading-spinner"></span>
					<span class="text-sm">Chargement...</span>
				</div>
			{:else if loadError}
				<div class="alert alert-error shadow-sm">
					<span class="text-sm">{loadError}</span>
				</div>
			{:else if rendezvous.length === 0}
				<div
					class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-base-content/15 bg-base-100 px-4 py-14 text-center"
				>
					<span class="text-3xl">🗓️</span>
					<p class="text-sm text-base-content/60">Aucun rendez-vous précédent</p>
				</div>
			{:else}
				<ul class="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
					{#each sortedRendezvous as rdv}
						<li
							class="flex items-center justify-between gap-3 rounded-2xl bg-base-100 px-4 py-3 shadow-sm"
						>
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
								>
									<span class="text-lg">📅</span>
								</div>
								<div>
									<p class="text-sm font-medium capitalize">{formatDate(rdv.timestamp)}</p>
									<p class="text-xs text-base-content/50">{formatTime(rdv.timestamp)}</p>
								</div>
							</div>
							{#if new Date(rdv.timestamp) < new Date()}
								<div class="badge badge-ghost badge-sm">Passé</div>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</main>
	</div>

	<!-- Floating action button, mobile-friendly, safe-area aware -->
	<div class="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
		<div
			class="mx-auto max-w-2xl bg-gradient-to-t from-base-200 via-base-200/95 to-transparent px-4 pt-2 pb-4"
		>
			<button
				class="btn w-full rounded-full shadow-lg btn-primary sm:mx-auto sm:flex sm:w-auto"
				onclick={openConfirm}
			>
				<span class="text-lg leading-none">+</span>
				Prendre un nouveau rendez-vous
			</button>
		</div>
	</div>

	<!-- Confirmation modal, bottom sheet on mobile -->
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={showConfirm}>
		<div class="modal-box sm:max-w-sm">
			<h3 class="mb-2 text-lg font-bold">Confirmer le rendez-vous</h3>
			<p class="mb-6 text-sm text-base-content/70">
				Voulez-vous vraiment prendre un nouveau rendez-vous chez <span class="font-medium"
					>{data.clinic_name}</span
				>&nbsp;?
			</p>
			<div class="modal-action flex-col-reverse gap-2 sm:flex-row">
				<button
					class="btn w-full btn-ghost sm:w-auto"
					onclick={cancelConfirm}
					disabled={submitting}
				>
					Annuler
				</button>
				<button
					class="btn w-full btn-primary sm:w-auto"
					onclick={confirmNewRendezVous}
					disabled={submitting}
				>
					{#if submitting}
						<span class="loading loading-sm loading-spinner"></span>
					{/if}
					Confirmer
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={cancelConfirm}>close</button>
		</form>
	</dialog>
{/if}
