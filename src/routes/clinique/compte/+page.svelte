<script lang="ts">
	import { clinic_types } from '$lib';
	import AppointmentBoard from '$lib/components/AppointmentBoard.svelte';
	import { redirect } from '@sveltejs/kit';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	if (data.isPayment) {
		if (data.payUrl) redirect(307, data.payUrl);
		else redirect(307, '/');
	}

	type Page = 'rendez-vous' | 'facturation' | 'parametres' | 'couverture';

	let currentPage: Page = $state('rendez-vous');

	let clinicName = $state(data.clinic_name);
	let doctorName = $state(data.doctor_name ?? '');
	let clinicPhone = $state(data.phone ?? '');
	let clinicSpec = $state(data.clinic_spec);
	let clinicAddress = $state(data.clinic_address ?? '');

	let updating = $state(false);
	let updateError = $state('');
	let updateSuccess = $state(false);

	// --- Cover photo state ---
	let coverPhotoUrl = $state(data.cover_photo_url ?? '');
	let coverPreview = $state<string | null>(null);
	let coverFile = $state<File | null>(null);
	let coverInput: HTMLInputElement | undefined = $state();
	let dragActive = $state(false);

	let uploadingCover = $state(false);
	let coverError = $state('');
	let coverSuccess = $state(false);

	function onCoverFileChosen(file: File | null) {
		coverError = '';
		coverSuccess = false;

		if (!file) return;

		if (!file.type.startsWith('image/')) {
			coverError = 'Veuillez sélectionner un fichier image.';
			return;
		}

		if (file.size > 8 * 1024 * 1024) {
			coverError = "L'image ne doit pas dépasser 8 Mo.";
			return;
		}

		coverFile = file;
		coverPreview = URL.createObjectURL(file);
	}

	function handleCoverInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onCoverFileChosen(target.files?.[0] ?? null);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;
		onCoverFileChosen(event.dataTransfer?.files?.[0] ?? null);
	}

	function clearCoverSelection() {
		coverFile = null;
		coverPreview = null;
		coverError = '';
		coverSuccess = false;
		if (coverInput) coverInput.value = '';
	}

	async function uploadCoverPhoto() {
		if (!coverFile) return;

		uploadingCover = true;
		coverError = '';
		coverSuccess = false;

		try {
			const formData = new FormData();
			formData.append('cover_photo', coverFile);

			const response = await fetch('/clinique/couverture', {
				method: 'PATCH',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message ?? 'Impossible de mettre à jour la photo de couverture.');
			}

			coverPhotoUrl = result.cover_photo_url ?? coverPreview ?? coverPhotoUrl;
			data.cover_photo_url = coverPhotoUrl;
			coverSuccess = true;
			coverFile = null;
			coverPreview = null;
			if (coverInput) coverInput.value = '';
		} catch (error) {
			coverError = error instanceof Error ? error.message : 'Une erreur est survenue.';
		} finally {
			uploadingCover = false;
		}
	}

	async function removeCoverPhoto() {
		uploadingCover = true;
		coverError = '';
		coverSuccess = false;

		try {
			const response = await fetch('/clinique/couverture', {
				method: 'DELETE'
			});

			if (!response.ok) {
				const result = await response.json().catch(() => ({}));
				throw new Error(result.message ?? 'Impossible de supprimer la photo de couverture.');
			}

			coverPhotoUrl = '';
			data.cover_photo_url = '';
			clearCoverSelection();
			coverSuccess = true;
		} catch (error) {
			coverError = error instanceof Error ? error.message : 'Une erreur est survenue.';
		} finally {
			uploadingCover = false;
		}
	}

	async function updateClinic() {
		updating = true;
		updateError = '';
		updateSuccess = false;

		try {
			const response = await fetch('/clinique/compte', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					clinic_name: clinicName,
					doctor_name: doctorName,
					clinic_phone: clinicPhone,
					clinic_spec: clinicSpec,
					clinic_address: clinicAddress
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message ?? 'Impossible de mettre à jour la clinique.');
			}

			updateSuccess = true;

			data.clinic_name = clinicName;
			data.doctor_name = doctorName;
			data.phone = clinicPhone;
			data.clinic_spec = clinicSpec;
			data.clinic_address = clinicAddress;
		} catch (error) {
			updateError = error instanceof Error ? error.message : 'Une erreur est survenue.';
		} finally {
			updating = false;
		}
	}

	function formatMonth(month: string) {
		const [year, monthNumber] = month.split('-');

		const date = new Date(Number(year), Number(monthNumber) - 1, 1);

		return new Intl.DateTimeFormat('fr-FR', {
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	function formatDate(date: string | null | undefined) {
		if (!date) return '—';

		return new Intl.DateTimeFormat('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}).format(new Date(date));
	}

	function formatAmount(amount: number) {
		return (
			new Intl.NumberFormat('fr-TN', {
				minimumFractionDigits: 3,
				maximumFractionDigits: 3
			}).format(amount) + ' TND'
		);
	}
</script>

<div class="min-h-screen bg-base-200/50 pb-28">
	<!-- Clinic header -->
	<header class="flex items-stretch overflow-hidden border border-base-300 bg-base-100 shadow-sm">
		<!-- ID-badge spine -->
		<div class="w-1.5 shrink-0 bg-primary" aria-hidden="true"></div>

		<div
			class="flex flex-1 flex-col gap-3 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:p-4"
		>
			<!-- Identity -->
			<div class="flex min-w-0 flex-col gap-1.5">
				<div class="flex flex-wrap items-baseline gap-2">
					<h1 class="truncate text-base font-bold text-base-content sm:text-lg">
						{data.clinic_name}
					</h1>

					<span
						class="badge rounded-none badge-outline badge-sm font-semibold tracking-wide uppercase badge-primary"
					>
						{data.clinic_spec}
					</span>
				</div>

				<div class="flex items-center gap-1.5 text-sm text-base-content/70">
					<svg
						class="h-4 w-4 shrink-0 text-base-content/50"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
							stroke="currentColor"
							stroke-width="1.6"
						/>
						<path
							d="M4.5 20c1.2-3.8 4.2-6 7.5-6s6.3 2.2 7.5 6"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
						/>
					</svg>

					<span class="truncate font-medium">
						Dr. {data.doctor_name}
					</span>
				</div>
			</div>

			<!-- Status -->
			<div class="flex flex-wrap items-center gap-2 sm:gap-3">
				{#if !data.verified}
					<div
						class="badge shrink-0 gap-1.5 badge-outline px-3 py-3 text-xs font-semibold badge-warning sm:text-sm"
					>
						<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
							<path
								d="M12 7.5v5.2l3.2 2"
								stroke="currentColor"
								stroke-width="1.6"
								stroke-linecap="round"
							/>
						</svg>

						<span class="whitespace-nowrap"> Téléphone non vérifié </span>
					</div>
				{/if}

				<a
					href="/clinique/aurevoire"
					class="badge shrink-0 rounded-none badge-outline px-3 py-3 text-xs opacity-75 badge-error hover:badge-secondary active:bg-secondary active:text-secondary-content sm:text-sm"
				>
					Déconnexion
				</a>
			</div>
		</div>
	</header>

	<!-- Main content -->
	<main class="relative">
		{#if currentPage === 'rendez-vous'}
			{#if !data.verified}
				<img
					src="../unverified.svg"
					alt=""
					class="m-auto mt-20 h-48 w-48 opacity-40 invert md:h-72 md:w-72"
				/>
			{:else}
				<AppointmentBoard initialAppointments={data.appointments} />
			{/if}
		{:else if currentPage === 'facturation'}
			<section class="mx-auto max-w-6xl p-4 sm:p-6">
				<div class="mb-6">
					<h2 class="text-xl font-bold sm:text-2xl">Facturation</h2>

					<p class="mt-1 text-sm text-base-content/60">
						Historique de votre abonnement Medlink et paiements à venir.
					</p>
				</div>

				<div class="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
					<div class="overflow-x-auto">
						<table class="table">
							<thead>
								<tr>
									<th>Abonnement</th>
									<th>Montant</th>
									<th>Échéance</th>
									<th>Paiement</th>
									<th>Statut</th>
								</tr>
							</thead>

							<tbody>
								{#if data.subscription_payments?.length}
									{#each data.subscription_payments as payment}
										<tr class="hover:bg-base-200/50">
											<td>
												<div class="font-semibold capitalize">
													{formatMonth(payment.month)}
												</div>

												<div class="text-xs text-base-content/50">Abonnement mensuel</div>
											</td>

											<td class="font-medium">
												{formatAmount(payment.amount)}
											</td>

											<td>
												{formatDate(payment.due_at)}
											</td>

											<td>
												{formatDate(payment.paid_at)}
											</td>

											<td>
												{#if payment.status === 'paid'}
													<span class="badge gap-1.5 badge-outline font-medium badge-success">
														<span class="h-1.5 w-1.5 rounded-full bg-success"></span>
														Payé
													</span>
												{:else}
													<span class="badge gap-1.5 badge-outline font-medium badge-warning">
														<span class="h-1.5 w-1.5 rounded-full bg-warning"></span>
														En attente
													</span>
												{/if}
											</td>
										</tr>
									{/each}
								{:else}
									<tr>
										<td colspan="5">
											<div
												class="flex min-h-32 items-center justify-center text-sm text-base-content/50"
											>
												Aucun paiement enregistré.
											</div>
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		{:else if currentPage === 'parametres'}
			<section class="mx-auto max-w-3xl p-4 sm:p-6">
				<div class="mb-6">
					<h2 class="text-xl font-bold sm:text-2xl">Paramètres</h2>

					<p class="mt-1 text-sm text-base-content/60">
						Modifiez les informations de votre clinique.
					</p>
				</div>

				<form
					class="space-y-5 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6"
					onsubmit={(event) => {
						event.preventDefault();
						updateClinic();
					}}
				>
					<!-- Nom de la clinique -->
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text mt-2 font-semibold"> Nom de la clinique </span>
						</div>

						<input
							type="text"
							class="input-bordered input w-full"
							bind:value={clinicName}
							placeholder="Nom de la clinique"
							required
						/>
					</label>

					<!-- Médecin -->
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text mt-2 font-semibold"> Nom du médecin </span>
						</div>

						<input
							type="text"
							class="input-bordered input w-full"
							bind:value={doctorName}
							placeholder="Nom du médecin"
							required
						/>
					</label>

					<!-- Téléphone -->
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text mt-2 font-semibold"> Numéro de téléphone </span>
						</div>

						<input
							type="tel"
							class="input-bordered input w-full"
							bind:value={clinicPhone}
							placeholder="+216 XX XXX XXX"
							required
						/>
					</label>

					<!-- Spécialité -->
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text mt-2 font-semibold"> Spécialité </span>
						</div>
						<select
							name="clinic_spec"
							id="clinic_spec"
							class="select w-full outline-none"
							bind:value={clinicSpec}
						>
							{#each clinic_types as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</label>

					<!-- Adresse -->
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text mt-2 font-semibold"> Adresse </span>
						</div>

						<textarea
							class="textarea-bordered textarea min-h-24 w-full"
							bind:value={clinicAddress}
							placeholder="Adresse de la clinique"
							required></textarea>
					</label>

					{#if updateError}
						<div class="alert alert-error">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>

							<span>{updateError}</span>
						</div>
					{/if}

					{#if updateSuccess}
						<div class="alert alert-success">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>

							<span> Les informations de la clinique ont été mises à jour. </span>
						</div>
					{/if}

					<div class="flex justify-end pt-2">
						<button type="submit" class="btn btn-primary" disabled={updating}>
							{#if updating}
								<span class="loading loading-sm loading-spinner"></span>
								Enregistrement...
							{:else}
								Enregistrer les modifications
							{/if}
						</button>
					</div>
				</form>
			</section>
		{:else if currentPage === 'couverture'}
			<section class="mx-auto max-w-3xl p-4 sm:p-6">
				<div class="mb-6">
					<h2 class="text-xl font-bold sm:text-2xl">Photo de couverture</h2>

					<p class="mt-1 text-sm text-base-content/60">
						Cette image apparaît en haut du profil public de votre clinique.
					</p>
				</div>

				<div class="space-y-5 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
					<!-- Current / preview image -->
					<div
						class="relative flex aspect-[16/7] w-full items-center justify-center overflow-hidden rounded-box border border-base-300 bg-base-200 sm:aspect-[21/7]"
					>
						{#if coverPreview}
							<img
								src={coverPreview}
								alt="Aperçu de la photo de couverture"
								class="h-full w-full object-cover"
							/>
						{:else if coverPhotoUrl}
							<img
								src={coverPhotoUrl}
								alt="Photo de couverture actuelle"
								class="h-full w-full object-cover"
							/>
						{:else}
							<div class="flex flex-col items-center gap-2 text-base-content/40">
								<svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
									<circle cx="8" cy="9" r="1.4" stroke="currentColor" stroke-width="1.4" />
								</svg>
								<span class="text-xs font-medium sm:text-sm"> Aucune photo de couverture </span>
							</div>
						{/if}
					</div>

					<!-- Dropzone / picker -->
					<label
						for="cover-photo-input"
						class="flex cursor-pointer flex-col {dragActive
							? 'bg-primary/5'
							: ''} items-center justify-center gap-2 rounded-box border-2 border-dashed p-6 text-center transition-colors sm:p-8"
						class:border-primary={dragActive}
						class:border-base-300={!dragActive}
						ondragover={(event) => {
							event.preventDefault();
							dragActive = true;
						}}
						ondragleave={() => (dragActive = false)}
						ondrop={handleDrop}
					>
						<svg
							class="h-8 w-8 text-base-content/40"
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M12 16V4m0 0-4 4m4-4 4 4"
								stroke="currentColor"
								stroke-width="1.7"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
								stroke="currentColor"
								stroke-width="1.7"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>

						<span class="text-sm font-semibold text-base-content sm:text-base">
							Touchez pour choisir une image
						</span>

						<span class="text-xs text-base-content/50">
							ou glissez-déposez ici (JPG, PNG — 8 Mo max)
						</span>

						<input
							id="cover-photo-input"
							bind:this={coverInput}
							type="file"
							accept="image/*"
							class="hidden"
							onchange={handleCoverInputChange}
						/>
					</label>

					{#if coverError}
						<div class="alert alert-error">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>

							<span>{coverError}</span>
						</div>
					{/if}

					{#if coverSuccess}
						<div class="alert alert-success">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>

							<span> Photo de couverture mise à jour. </span>
						</div>
					{/if}

					<div
						class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between"
					>
						<button
							type="button"
							class="btn btn-ghost text-error btn-sm sm:btn-md"
							disabled={uploadingCover || (!coverPhotoUrl && !coverPreview)}
							onclick={() => (coverPreview ? clearCoverSelection() : removeCoverPhoto())}
						>
							{coverPreview ? 'Annuler la sélection' : 'Supprimer la photo'}
						</button>

						<button
							type="button"
							class="btn w-full btn-primary sm:w-auto"
							disabled={!coverFile || uploadingCover}
							onclick={uploadCoverPhoto}
						>
							{#if uploadingCover}
								<span class="loading loading-sm loading-spinner"></span>
								Enregistrement...
							{:else}
								Enregistrer la photo
							{/if}
						</button>
					</div>
				</div>
			</section>
		{/if}
	</main>

	<!-- Floating navigation dock -->
	<nav
		class="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit max-w-[calc(100%-2rem)]"
		aria-label="Navigation principale"
	>
		<div
			class="flex items-center gap-1 overflow-x-auto rounded-2xl border border-base-300 bg-base-100/95 p-1.5 shadow-xl shadow-base-content/10 backdrop-blur-xl"
		>
			<!-- Rendez-vous -->
			<button
				type="button"
				class:btn-primary={currentPage === 'rendez-vous'}
				class:btn-ghost={currentPage !== 'rendez-vous'}
				class="btn h-12 min-h-12 shrink-0 gap-2 rounded-xl px-3 sm:px-5"
				onclick={() => (currentPage = 'rendez-vous')}
				aria-current={currentPage === 'rendez-vous' ? 'page' : undefined}
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="3.5"
						y="5"
						width="17"
						height="16"
						rx="2"
						stroke="currentColor"
						stroke-width="1.7"
					/>
					<path
						d="M7 3v4M17 3v4M3.5 9h17"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
					/>
					<path
						d="M8 13h2M14 13h2M8 17h2"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
					/>
				</svg>

				<span class="hidden sm:inline"> Rendez-vous </span>
			</button>

			<!-- Facturation -->
			<button
				type="button"
				class:btn-primary={currentPage === 'facturation'}
				class:btn-ghost={currentPage !== 'facturation'}
				class="btn h-12 min-h-12 shrink-0 gap-2 rounded-xl px-3 sm:px-5"
				onclick={() => (currentPage = 'facturation')}
				aria-current={currentPage === 'facturation' ? 'page' : undefined}
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="3"
						y="5"
						width="18"
						height="14"
						rx="2"
						stroke="currentColor"
						stroke-width="1.7"
					/>
					<path
						d="M3 10h18M7 15h3"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
					/>
				</svg>

				<span class="hidden sm:inline"> Facturation </span>
			</button>

			<!-- Paramètres -->
			<button
				type="button"
				class:btn-primary={currentPage === 'parametres'}
				class:btn-ghost={currentPage !== 'parametres'}
				class="btn h-12 min-h-12 shrink-0 gap-2 rounded-xl px-3 sm:px-5"
				onclick={() => (currentPage = 'parametres')}
				aria-current={currentPage === 'parametres' ? 'page' : undefined}
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
						stroke="currentColor"
						stroke-width="1.7"
					/>
					<path
						d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06A1.7 1.7 0 0 0 19.4 10c.25.62.86 1.03 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linejoin="round"
					/>
				</svg>

				<span class="hidden sm:inline"> Paramètres </span>
			</button>

			<!-- Divider before the right-aligned cover photo action -->
			<div class="mx-1 h-8 w-px shrink-0 bg-base-300" aria-hidden="true"></div>

			<!-- Photo de couverture -->
			<button
				type="button"
				class:btn-primary={currentPage === 'couverture'}
				class:btn-ghost={currentPage !== 'couverture'}
				class="btn h-12 min-h-12 shrink-0 gap-2 rounded-xl px-3 sm:px-5"
				onclick={() => (currentPage = 'couverture')}
				aria-current={currentPage === 'couverture' ? 'page' : undefined}
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="3"
						y="4"
						width="18"
						height="16"
						rx="2"
						stroke="currentColor"
						stroke-width="1.7"
					/>
					<path
						d="M3 16l5-5 4 4 3-3 6 6"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<circle cx="8" cy="9" r="1.3" stroke="currentColor" stroke-width="1.3" />
				</svg>

				<span class="hidden sm:inline"> Couverture </span>
			</button>
		</div>
	</nav>
</div>
