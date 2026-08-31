<script lang="ts">
	let {
		id,
		name,
		number,
		date,
		datetime,
		accentClass = 'bg-primary',
		dragging = false,
		onReschedule,
		onCancel
	} = $props();

	let dialogEl: HTMLDialogElement;
	let draftDatetime = $state(datetime);

	function openRescheduleDialog() {
		draftDatetime = datetime; // réinitialise à la valeur actuelle à chaque ouverture
		dialogEl.showModal();
	}

	function confirmReschedule() {
		if (draftDatetime && draftDatetime !== datetime) {
			onReschedule?.(id, draftDatetime);
		}
		dialogEl.close();
	}

	function handleCancel() {
		onCancel?.(id);
	}
</script>

<div
	class="card-compact card w-full border border-base-300 bg-base-100 shadow-sm transition-shadow duration-150 sm:w-64"
	class:shadow-lg={dragging}
>
	<div class="relative flex items-center gap-3 rounded-box p-4">
		<div class="absolute top-0 bottom-0 left-0 w-1.5 {accentClass}"></div>

		<div class="min-w-0 flex-1 pl-1.5">
			<span class="block text-[10px] tracking-wider text-base-content/50 uppercase">
				Rendez-vous
			</span>
			<h3 class="truncate text-base font-semibold text-base-content sm:text-sm">{name}</h3>
			<div class="mt-0.5 flex items-center gap-1.5 text-sm text-base-content/60 sm:text-xs">
				<span>{date}</span>
				<span class="text-base-content/30">•</span>
				<span>N° {number}</span>
			</div>
		</div>

		<div class="dropdown dropdown-end shrink-0">
			<div
				tabindex="0"
				role="button"
				class="btn btn-square btn-ghost btn-sm"
				aria-label={`Options pour le rendez-vous de ${name}`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<circle cx="12" cy="5" r="1.5" />
					<circle cx="12" cy="12" r="1.5" />
					<circle cx="12" cy="19" r="1.5" />
				</svg>
			</div>
			<ul
				class="menu dropdown-content z-20 w-44 menu-sm rounded-box border border-base-300 bg-base-100 p-2 shadow-md"
			>
				<li>
					<button type="button" onclick={openRescheduleDialog}> Modifier l'heure </button>
				</li>
				<li>
					<button type="button" class="text-error" onclick={handleCancel}>
						Annuler le rendez-vous
					</button>
				</li>
			</ul>
		</div>
	</div>
</div>

<dialog bind:this={dialogEl} class="modal">
	<div class="modal-box max-w-sm">
		<h3 class="text-base font-semibold">Modifier l'heure de {name}</h3>
		<p class="mt-1 text-xs text-base-content/50">Rendez-vous n° {number}</p>

		<div class="form-control mt-4">
			<label class="label" for={`reschedule-${id}`}>
				<span class="label-text">Nouvelle date et heure</span>
			</label>
			<input
				id={`reschedule-${id}`}
				type="datetime-local"
				class="input-bordered input w-full"
				bind:value={draftDatetime}
			/>
		</div>

		<div class="modal-action">
			<form method="dialog" class="flex gap-2">
				<button type="button" class="btn btn-ghost" onclick={() => dialogEl.close()}>
					Annuler
				</button>
				<button type="button" class="btn btn-primary" onclick={confirmReschedule}>
					Enregistrer
				</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>fermer</button>
	</form>
</dialog>
