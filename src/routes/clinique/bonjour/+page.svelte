<script lang="ts">
	import { page } from '$app/state';
	import type { LoginInformation } from '$lib/types';

	let loadingAnimation: HTMLImageElement;
	let inputContent: HTMLFieldSetElement;
	let erroneous: boolean = $state(false);

	const { phone, reg_email, reg_password } = page.state as any;

	let login_information: LoginInformation = $state({
		email: reg_email,
		phone_number: phone,
		password: reg_password
	});

	let tab: number = $state(reg_email ? 1 : phone ? 2 : 1);

	const login = async () => {
		inputContent.classList.add('opacity-0');
		loadingAnimation.classList.remove('opacity-0');
		loadingAnimation.classList.add('opacity-40');

		const loginReq = await fetch('', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(login_information)
		});
		if (loginReq.redirected) {
			window.location.href = loginReq.url;
		}
		erroneous = loginReq.status != 200;

		inputContent.classList.remove('opacity-0');
		loadingAnimation.classList.add('opacity-0');
		loadingAnimation.classList.remove('opacity-40');
	};
</script>

<h1>{phone}</h1>
<h1>{reg_email}</h1>
<h2>{reg_password}</h2>

<div class="hero min-h-screen" style="background: url('../bg.svg');">
	<div class="hero-content flex-col gap-5">
		<div class="text-center lg:text-left">
			<h1 class="text-3xl font-bold drop-shadow-xl sm:text-5xl">Se connecter</h1>
		</div>
		<div class="card shrink-0 overflow-clip border-2 border-gray-700 bg-base-100 shadow-2xl">
			<img
				bind:this={loadingAnimation}
				src="../loading.svg"
				class="absolute inset-0 m-auto w-30 animate-spin place-self-center self-center justify-self-center opacity-0 invert transition-opacity"
				style="animation-duration: 3s;"
				alt=""
			/>

			<div class="card-body transition-opacity sm:flex-row">
				<fieldset class="fieldset flex flex-col gap-3 transition-opacity" bind:this={inputContent}>
					<div class="grid min-w-sm gap-2">
						<div role="tablist" class="tabs tabs-lift w-full">
							<button
								role="tab"
								class="tab {tab == 1 ? 'tab-active' : ''}"
								onclick={() => (tab = 1)}>Email</button
							>
							<button
								role="tab"
								class="tab {tab == 2 ? 'tab-active' : ''}"
								onclick={() => (tab = 2)}>Numéro du telephone</button
							>
						</div>
						{#if tab == 1}
							<div class="flex flex-col gap-1">
								<input
									id="email"
									class="input w-full min-w-xs outline-none {erroneous ? 'border-red-700' : ''}"
									type="email"
									placeholder="Saisissez votre adresse e-mail"
									bind:value={login_information.email}
								/>
							</div>
						{/if}
						{#if tab == 2}
							<div class="flex flex-col gap-1">
								<div class="flex w-full items-center gap-4">
									<p class="pointer-events-none fieldset-label text-lg select-none">+216</p>
									<input
										id="phone"
										class="input outline-none {erroneous ? 'border-red-700' : ''}"
										type="text"
										placeholder="Saisissez votre numéro du telephone"
										bind:value={login_information.phone_number}
									/>
								</div>
							</div>
						{/if}
					</div>
					<div class="flex flex-col gap-1">
						<label class="fieldset-label" for="password">Mot de passe</label>
						<input
							id="password"
							class="input w-full outline-none {erroneous ? 'border-red-700' : ''}"
							type="password"
							placeholder="Saisissez votre mot de passe"
							bind:value={login_information.password}
						/>
					</div>
				</fieldset>
			</div>
			<button onclick={login} class="btn mr-4 mb-4 ml-auto w-11/12 btn-neutral sm:w-max"
				>Entrer</button
			>
		</div>
	</div>
</div>
