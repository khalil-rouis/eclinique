<script lang="ts">
	import AppointmentBoard from '$lib/components/AppointmentBoard.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

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
					<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.6" />
					<path
						d="M4.5 20c1.2-3.8 4.2-6 7.5-6s6.3 2.2 7.5 6"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
					/>
				</svg>
				<span class="truncate font-medium">Dr. {data.doctor_name}</span>
			</div>
		</div>

		<!-- Status -->
		<div class="flex flex-wrap items-center gap-2 sm:gap-3">
			{#if !data.isVerified}
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
					<span class="whitespace-nowrap">Téléphone non vérifié</span>
				</div>
			{/if}
			<a
				href="/clinique/aurevoire"
				class="badge shrink-0 rounded-none badge-outline px-3 py-3 text-xs opacity-75 badge-error hover:badge-secondary active:bg-secondary active:text-secondary-content sm:text-sm"
				>Déconnexion</a
			>
		</div>
	</div>
</header>
<main>
	{#if !data.isVerified}
		<img
			src="../unverified.svg"
			alt=""
			class="absolute inset-0 top-0 bottom-0 m-auto h-48 w-48 opacity-40 invert md:h-72 md:w-72"
		/>
	{:else}
		<AppointmentBoard />
	{/if}
</main>
