<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PatientInformation } from '$lib/types';
	let inputContent: HTMLDivElement;
	let loadingAnimation: HTMLImageElement;

	let patient_information: PatientInformation = $state({
		full_name: '',
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
			body: JSON.stringify(patient_information)
		});

		const response = await startReg.json();
		if (!startReg.ok) {
			if (startReg.status == 409) {
				goto('/patient/bonjour', {
					state: {
						phone: response.message == 'phone' ? patient_information.phone : undefined,
						reg_password: patient_information.reg_password
					}
				});
			}
			erroneousFields =
				response.message == 'Bad request' ? ['*'] : await JSON.parse(response.message);
		}

		// add phone verification

		loadingAnimation.classList.add('opacity-0');
		loadingAnimation.classList.remove('opacity-40');
		inputContent.classList.remove('opacity-0', 'pointer-events-none', 'select-none');
	};
</script>

<div class="hero min-h-screen" style="background: url('../bg.svg');">
	<div class="hero-content flex-col gap-5">
		<div class="text-center lg:text-left">
			<h1 class="text-3xl font-bold drop-shadow-xl sm:text-5xl">Inscription du patient</h1>
		</div>
		<div class="card shrink-0 overflow-clip border-2 border-gray-700 bg-base-100 shadow-2xl">
			<img
				bind:this={loadingAnimation}
				src="../loading.svg"
				class="absolute inset-0 m-auto w-30 animate-spin place-self-center self-center justify-self-center opacity-0 invert transition-opacity"
				style="animation-duration: 3s;"
				alt=""
			/>
			<div class="card-body transition-opacity" bind:this={inputContent}>
				<fieldset class="fieldset flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<label class="fieldset-label" for="full_name">Nom complet</label>
						<input
							id="full_name"
							class="input w-full min-w-xs outline-none {erroneousFields.indexOf('full_name') !=
								-1 || erroneousFields[0] == '*'
								? 'border-red-700'
								: ''}"
							type="text"
							placeholder="Au moins 6 caractères"
							bind:value={patient_information.full_name}
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
							bind:value={patient_information.reg_password}
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
								bind:value={patient_information.phone}
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
