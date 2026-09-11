<script lang="ts">
	const { data } = $props();
</script>

<div class="min-h-screen bg-base-200 pb-16">
	<div class="mx-auto max-w-2xl px-4 py-8">
		<h1 class="mb-1 text-2xl font-bold">Mon compte</h1>
		<p class="mb-6 text-sm text-base-content/60">Cliniques avec un rendez-vous à venir</p>

		{#if data.cliniques.length === 0}
			<div
				class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-base-content/15 bg-base-100 px-4 py-14 text-center"
			>
				<span class="text-3xl">🏥</span>
				<p class="text-sm text-base-content/60">Aucun rendez-vous à venir</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each data.cliniques as clinique}
					<a
						href={`/clinique/rendezvous?ccid=${clinique.ccid}`}
						class="group relative flex flex-col justify-between rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30"
					>
						<div>
							<h2 class="text-base leading-snug font-semibold">{clinique.name}</h2>
							{#if clinique.spec}
								<p class="mt-0.5 text-xs text-base-content/50 italic">{clinique.spec}</p>
							{/if}
						</div>

						<div class="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
							Voir le rendez-vous
							<span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true"
								>→</span
							>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
