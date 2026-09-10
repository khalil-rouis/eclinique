<script lang="ts">
	const { data } = $props();
	console.log(data);
	export const ssr = false;
</script>

{#if data.error}
	<h1>ERROR: {data.error}</h1>
{:else}
	<h1>welcome to {data.clinic_name}</h1>
{/if}
