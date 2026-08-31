<script lang="ts">
	import { goto } from '$app/navigation';
	import { clinic_types } from '$lib';
	import type { ClinicInformation } from '$lib/types';
	let inputContent: HTMLDivElement;
	let loadingAnimation: HTMLImageElement;

	let clinic_information: ClinicInformation = $state({
		clinic_name: '',
		doctor_name: '',
		clinic_spec: clinic_types[0],
		reg_email: '',
		reg_password: '',
		phone: ''
	});

	let erroneousFields: string[] = $state([]);

	const setupRegistration = async () => {
		erroneousFields = [];

		loadingAnimation.classList.remove('opacity-0');
		loadingAnimation.classList.add('opacity-40');
		inputContent.classList.add('opacity-0', 'pointer-events-none', 'select-none');

		const startReg = await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(clinic_information)
		});

		const response = await startReg.json();
		if (!startReg.ok) {
			if (startReg.status == 409) {
				goto('/clinique/bonjour', {
					state: {
						phone: response.message == 'phone' ? clinic_information.phone : undefined,
						reg_email: response.message == 'reg_email' ? clinic_information.reg_email : undefined,
						reg_password: clinic_information.reg_password
					}
				});
			}
			erroneousFields =
				response.message == 'Bad request' ? ['*'] : await JSON.parse(response.message);
		}

		// load phone verification screen
		loadingAnimation.classList.add('opacity-0');
		loadingAnimation.classList.remove('opacity-40');
		inputContent.classList.remove('opacity-0', 'pointer-events-none', 'select-none');
	};
</script>

<div class="hero min-h-screen" style="background: url('../bg.svg');">
	<div class="hero-content flex-col gap-5">
		<div class="text-center lg:text-left">
			<h1 class="text-3xl font-bold drop-shadow-xl sm:text-5xl">Inscription du clinique</h1>
		</div>
		<div class="card shrink-0 overflow-clip border-2 border-gray-700 bg-base-100 shadow-2xl">
			<img
				bind:this={loadingAnimation}
				src="../loading.svg"
				class="absolute inset-0 m-auto w-30 animate-spin place-self-center self-center justify-self-center opacity-0 invert transition-opacity"
				style="animation-duration: 3s;"
				alt=""
			/>
			<div class="card-body transition-opacity sm:flex-row" bind:this={inputContent}>
				<fieldset class="fieldset flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<label class="fieldset-label" for="clinic_name">Nom du clinique</label>
						<input
							id="clinic_name"
							class="input w-full min-w-xs outline-none {erroneousFields.indexOf('clinic_name') !=
								-1 || erroneousFields[0] == '*'
								? 'border-red-700'
								: ''}"
							type="text"
							placeholder="Au moins 6 caractères"
							bind:value={clinic_information.clinic_name}
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label class="fieldset-label" for="doctor_name">Nom du docteur</label>
						<input
							id="doctor_name"
							class="input w-full outline-none {erroneousFields.indexOf('doctor_name') != -1 ||
							erroneousFields[0] == '*'
								? 'border-red-700'
								: ''}"
							type="text"
							placeholder="Au moins 6 caractères"
							bind:value={clinic_information.doctor_name}
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label class="fieldset-label" for="clinic_spec">Spécialité du clinique</label>
						<select
							name="clinic_spec"
							id="clinic_spec"
							class="select outline-none {erroneousFields.indexOf('clinic_spec') != -1 ||
							erroneousFields[0] == '*'
								? 'border-red-700'
								: ''}"
							bind:value={clinic_information.clinic_spec}
						>
							{#each clinic_types as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>
				</fieldset>
				<div class="divider hidden divider-horizontal sm:flex"></div>
				<fieldset class="fieldset flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<label class="fieldset-label" for="reg_email">Email</label>
						<input
							id="reg_email"
							class="input w-full min-w-xs outline-none {erroneousFields.indexOf('reg_email') !=
								-1 || erroneousFields[0] == '*'
								? 'border-red-700'
								: ''}"
							type="email"
							placeholder="example@gmail.com"
							bind:value={clinic_information.reg_email}
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label class="fieldset-label" for="reg_password">Mot de passe</label>
						<input
							id="reg_password"
							class="input w-full outline-none {erroneousFields.indexOf('reg_password') != -1 ||
							erroneousFields[0] == '*'
								? 'border-red-700'
								: ''}"
							type="password"
							placeholder="Au moins 8 caractères"
							bind:value={clinic_information.reg_password}
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label class="fieldset-label" for="phone">Numéro du telephone</label>
						<div class="flex w-full items-center gap-4">
							<p class="pointer-events-none fieldset-label text-lg select-none">+216</p>
							<input
								id="phone"
								class="input outline-none {erroneousFields.indexOf('phone') != -1 ||
								erroneousFields[0] == '*'
									? 'border-red-700'
									: ''}"
								type="text"
								placeholder="94123456"
								bind:value={clinic_information.phone}
							/>
						</div>
					</div>
				</fieldset>
			</div>
			<button
				onclick={setupRegistration}
				class="btn mr-4 mb-4 ml-auto flex w-11/12 btn-neutral sm:w-max"
				><img src="../arrow.svg" class="h-3 w-3 rotate-180 invert" alt="" /> Vérification du numéro de
				téléphone</button
			>
		</div>
	</div>
</div>
