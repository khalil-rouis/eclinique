<script lang="ts">
	let heroReady = $state(false);
	let statsInView = $state(false);
	let countPatients = $state(0);
	let countClinics = $state(0);
	let countRate = $state(0);
	let showLoginChoice = $state(false);

	const specialties = [
		'Cardiologie',
		'Dermatologie',
		'Pédiatrie',
		'Dentaire',
		'Gynécologie',
		'Ophtalmologie',
		'Kinésithérapie',
		'ORL',
		'Nutrition',
		'Psychologie'
	];

	const steps = [
		{
			title: 'Trouvez votre clinique',
			text: 'Cherchez par spécialité ou par nom, et consultez les disponibilités réelles en un coup d’œil.'
		},
		{
			title: 'Choisissez un créneau',
			text: 'Réservez l’horaire qui vous arrange. La confirmation arrive tout de suite, pas de rappel à attendre.'
		},
		{
			title: 'Présentez-vous, c’est tout',
			text: 'Plus besoin d’appeler ni de patienter en salle d’attente pour un ticket : votre place est déjà prise.'
		}
	];

	const heroWords = 'Un rendez-vous médical, en quelques battements.'.split(' ');

	function spotlight(node: HTMLElement) {
		function onMove(e: MouseEvent) {
			const rect = node.getBoundingClientRect();
			node.style.setProperty('--x', `${e.clientX - rect.left}px`);
			node.style.setProperty('--y', `${e.clientY - rect.top}px`);
		}
		node.addEventListener('mousemove', onMove);
		return { destroy: () => node.removeEventListener('mousemove', onMove) };
	}

	function animateCount(setter: (v: number) => void, target: number, duration = 1400) {
		const start = performance.now();
		function tick(now: number) {
			const progress = Math.min(1, (now - start) / duration);
			const eased = 1 - Math.pow(1 - progress, 3);
			setter(Math.round(eased * target));
			if (progress < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	function statsObserver(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !statsInView) {
					statsInView = true;
					animateCount((v) => (countPatients = v), 12400);
					animateCount((v) => (countClinics = v), 340);
					animateCount((v) => (countRate = v), 98);
				}
			},
			{ threshold: 0.4 }
		);
		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	}

	$effect(() => {
		const t = setTimeout(() => (heroReady = true), 60);
		return () => clearTimeout(t);
	});
</script>

<svelte:head>
	<title>eClinique — Rendez-vous médicaux, sans attendre</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="landing overflow-x-hidden bg-base-200 text-base-content">
	<!-- NAV -->
	<nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
		<div class="flex items-center gap-2">
			<svg
				width="26"
				height="26"
				viewBox="0 0 24 24"
				fill="none"
				class="text-primary"
				aria-hidden="true"
			>
				<path
					d="M2 12h4l2-7 4 14 3-9 2 5h5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span class="font-display text-xl font-semibold">eClinique</span>
		</div>
		<div class="hidden items-center gap-8 text-sm font-medium text-base-content/70 md:flex">
			<a href="#comment-ca-marche" class="transition-colors hover:text-primary">Comment ça marche</a
			>
			<a href="#cliniques" class="transition-colors hover:text-primary">Pour les cliniques</a>
			<a href="#temoignage" class="transition-colors hover:text-primary">Témoignages</a>
		</div>
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={() => (showLoginChoice = true)}
				class="hidden rounded text-sm font-medium text-base-content/70 transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:inline"
			>
				Connexion
			</button>
			<a
				href="/patient/rendezvous"
				class="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-content transition-colors hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				Prendre rendez-vous
			</a>
		</div>
	</nav>
	<!-- LOGIN CHOICE MODAL -->
	<dialog class="modal" class:modal-open={showLoginChoice}>
		<div class="modal-box max-w-sm">
			<h3 class="font-display mb-1 text-lg font-semibold">Se connecter</h3>
			<p class="mb-6 text-sm text-base-content/60">Choisissez votre espace pour continuer.</p>

			<div class="flex flex-col gap-3">
				<a
					href="/patient/bonjour"
					class="group flex items-center justify-between rounded-xl bg-base-200 px-4 py-3.5 transition-colors hover:bg-primary/10"
				>
					<span class="flex items-center gap-3">
						<span
							class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg text-primary"
						>
							🙂
						</span>
						<span class="font-medium">Espace patient</span>
					</span>
					<svg
						class="h-4 w-4 text-base-content/40 transition-colors group-hover:text-primary"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M9 6l6 6-6 6"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
				<a
					href="/clinique/bonjour"
					class="group flex items-center justify-between rounded-xl bg-base-200 px-4 py-3.5 transition-colors hover:bg-primary/10"
				>
					<span class="flex items-center gap-3">
						<span
							class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg text-primary"
						>
							🏥
						</span>
						<span class="font-medium">Espace clinique</span>
					</span>
					<svg
						class="h-4 w-4 text-base-content/40 transition-colors group-hover:text-primary"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M9 6l6 6-6 6"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			</div>

			<div class="modal-action mt-6">
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					onclick={() => (showLoginChoice = false)}
				>
					Annuler
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={() => (showLoginChoice = false)}>close</button>
		</form>
	</dialog>

	<!-- HERO -->
	<header
		class="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-10 pb-20 md:grid-cols-[1.1fr_0.9fr]"
	>
		<div>
			<h1 class="font-display text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-[3.4rem]">
				{#each heroWords as word, i}
					<span
						class="mr-[0.28em] inline-block"
						style="opacity: {heroReady ? 1 : 0}; transform: translateY({heroReady
							? 0
							: '0.6em'}); transition: opacity 0.6s ease {i *
							0.05}s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) {i * 0.05}s;"
					>
						{word}
					</span>
				{/each}
			</h1>

			<p
				class="mt-6 max-w-md text-lg text-base-content/70"
				style="opacity: {heroReady ? 1 : 0}; transition: opacity 0.7s ease 0.5s;"
			>
				eClinique connecte patients et cliniques : réservez en ligne, suivez vos rendez-vous, et
				laissez votre clinique gérer son planning sans papier ni téléphone qui sonne.
			</p>

			<div
				class="mt-8 flex flex-wrap items-center gap-4"
				style="opacity: {heroReady ? 1 : 0}; transition: opacity 0.7s ease 0.65s;"
			>
				<a
					href="/patient/nouveau"
					class="rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-content shadow-lg transition-colors hover:bg-accent/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					Prendre rendez-vous
				</a>
				<a
					href="/clinique/nouveau"
					class="rounded-full border-2 border-primary/30 px-7 py-3 font-semibold text-primary transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					Je suis une clinique
				</a>
			</div>
		</div>

		<!-- pulse-to-ticket visual -->
		<div class="relative h-72 sm:h-80">
			<svg
				class="pulse-line absolute inset-0 h-full w-full text-primary"
				viewBox="0 0 400 200"
				fill="none"
				preserveAspectRatio="xMidYMid meet"
				aria-hidden="true"
			>
				<path
					d="M0 100 H120 L145 40 L175 160 L205 70 L230 100 H400"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>

			<div
				class="ticket absolute right-2 bottom-4 w-56 rounded-2xl bg-base-100 p-4 shadow-xl ring-1 ring-base-content/10"
			>
				<div class="flex items-center justify-between">
					<span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
						Confirmé
					</span>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						class="text-primary"
						aria-hidden="true"
					>
						<path
							d="M5 13l4 4L19 7"
							stroke="currentColor"
							stroke-width="2.4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<p class="font-display mt-3 text-lg font-semibold">Clinique Ennour</p>
				<p class="text-sm text-base-content/60">Jeudi 17 sept · 14:30</p>
			</div>
		</div>
	</header>

	<!-- MARQUEE -->
	<div class="overflow-hidden border-y border-base-300 bg-base-100 py-5">
		<div class="marquee flex w-max gap-10 whitespace-nowrap">
			{#each [...specialties, ...specialties] as spec}
				<span class="text-sm font-medium text-base-content/50">{spec}</span>
			{/each}
		</div>
	</div>

	<!-- HOW IT WORKS -->
	<section id="comment-ca-marche" class="mx-auto max-w-6xl px-6 py-24">
		<div class="mb-14 max-w-lg">
			<h2 class="font-display text-3xl leading-tight font-semibold sm:text-4xl">
				Trois étapes, aucun appel
			</h2>
			<p class="mt-3 text-base-content/65">
				Ce que ça change concrètement quand vous cherchez un rendez-vous.
			</p>
		</div>

		<div class="grid gap-5 sm:grid-cols-3">
			{#each steps as step, i}
				<div
					use:spotlight
					class="spot-card relative overflow-hidden rounded-2xl bg-base-100 p-6 ring-1 ring-base-content/10"
				>
					<div class="spot-glow"></div>
					<div class="relative">
						<div
							class="font-display mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content"
						>
							{i + 1}
						</div>
						<h3 class="font-display mb-2 text-lg font-semibold">{step.title}</h3>
						<p class="text-sm leading-relaxed text-base-content/65">{step.text}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- FEATURE: PATIENT -->
	<section class="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2">
		<div>
			<h2 class="font-display mb-4 text-3xl leading-tight font-semibold">
				Votre carnet de rendez-vous, toujours à jour
			</h2>
			<p class="mb-6 max-w-md leading-relaxed text-base-content/65">
				Chaque rendez-vous pris apparaît immédiatement, classé par proximité dans le temps. Plus
				besoin de retenir la date : eClinique s’en souvient pour vous, et vous prévient si quelque
				chose échoue avant que ça ne devienne un problème.
			</p>
			<a
				href="/patient/compte"
				class="font-semibold text-primary transition-colors hover:text-primary/80"
			>
				Voir mes rendez-vous
			</a>
		</div>

		<div class="rounded-3xl bg-base-100 p-5 shadow-xl ring-1 ring-base-content/10">
			<p class="mb-3 px-1 text-xs font-semibold text-base-content/50">Historique des rendez-vous</p>
			<div class="flex flex-col gap-2">
				{#each [{ date: '11 sept. · 16:41', label: 'À venir', tone: 'bg-primary/10 text-primary' }, { date: '30 août · 09:00', label: 'Passé', tone: 'bg-base-content/10 text-base-content/50' }, { date: '14 août · 10:15', label: 'Passé', tone: 'bg-base-content/10 text-base-content/50' }] as row}
					<div class="flex items-center justify-between rounded-xl bg-base-200 px-3 py-3">
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-base-100 text-sm"
							>
								📅
							</div>
							<span class="text-sm font-medium">{row.date}</span>
						</div>
						<span class="rounded-full px-2.5 py-1 text-xs font-semibold {row.tone}"
							>{row.label}</span
						>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- FEATURE: CLINIC -->
	<section
		id="cliniques"
		class="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2"
	>
		<div
			class="order-2 rounded-3xl bg-base-100 p-5 shadow-xl ring-1 ring-base-content/10 md:order-1"
		>
			<p class="mb-3 px-1 text-xs font-semibold text-base-content/50">Planning du jour</p>
			<div class="grid grid-cols-3 gap-3">
				{#each [{ label: 'Matin', color: 'text-amber-400', names: ['Sara B.', 'Omar T.'] }, { label: 'Après-midi', color: 'text-sky-400', names: ['Yasmine K.'] }, { label: 'Soir', color: 'text-violet-400', names: ['Karim J.', 'Leila M.'] }] as col}
					<div class="rounded-xl bg-base-200 p-3">
						<p class="text-[11px] font-bold tracking-wide uppercase {col.color} mb-2">
							{col.label}
						</p>
						<div class="flex flex-col gap-2">
							{#each col.names as name}
								<div
									class="rounded-lg bg-base-100 px-2.5 py-2 text-xs font-medium ring-1 ring-base-content/10"
								>
									{name}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="order-1 md:order-2">
			<h2 class="font-display mb-4 text-3xl leading-tight font-semibold">
				Un planning qui s’organise tout seul
			</h2>
			<p class="mb-6 max-w-md leading-relaxed text-base-content/65">
				Les rendez-vous se rangent automatiquement par matin, après-midi et soir. Votre secrétariat
				garde une vue claire de la journée sans ressaisir un seul rendez-vous à la main.
			</p>
			<a
				href="/clinique/nouveau"
				class="font-semibold text-primary transition-colors hover:text-primary/80"
			>
				Ouvrir un espace clinique
			</a>
		</div>
	</section>

	<!-- STATS -->
	<section use:statsObserver class="bg-neutral py-20 text-neutral-content">
		<div class="mx-auto grid max-w-6xl gap-10 px-6 text-center sm:grid-cols-3">
			<div>
				<p class="font-display text-4xl font-semibold sm:text-5xl">
					{countPatients.toLocaleString('fr-FR')}+
				</p>
				<p class="mt-2 text-sm text-neutral-content/60">rendez-vous pris</p>
			</div>
			<div>
				<p class="font-display text-4xl font-semibold sm:text-5xl">{countClinics}</p>
				<p class="mt-2 text-sm text-neutral-content/60">cliniques partenaires</p>
			</div>
			<div>
				<p class="font-display text-4xl font-semibold sm:text-5xl">{countRate}%</p>
				<p class="mt-2 text-sm text-neutral-content/60">de patients satisfaits</p>
			</div>
		</div>
	</section>

	<!-- TESTIMONIAL -->
	<section id="temoignage" class="mx-auto max-w-3xl px-6 py-24 text-center">
		<p class="font-display text-2xl leading-snug sm:text-3xl">
			« Depuis qu’on utilise eClinique, on a réduit les rendez-vous manqués de moitié. Le planning
			s’organise pendant qu’on s’occupe des patients. »
		</p>
		<p class="mt-6 text-sm font-semibold text-base-content/60">
			Dr. Amira Cherni — Clinique Ennour
		</p>
	</section>

	<!-- CTA -->
	<section class="mx-auto max-w-6xl px-6 pb-24">
		<div class="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center sm:px-14">
			<div class="cta-glow"></div>
			<h2
				class="font-display relative mb-4 text-3xl font-semibold text-primary-content sm:text-4xl"
			>
				Prêt à simplifier vos rendez-vous ?
			</h2>
			<p class="relative mx-auto mb-8 max-w-md text-primary-content/75">
				Que vous soyez patient ou clinique, ça prend deux minutes pour commencer.
			</p>
			<div class="relative flex flex-wrap justify-center gap-4">
				<a
					href="/patient/rendezvous"
					class="rounded-full bg-base-100 px-7 py-3.5 font-semibold text-primary transition-colors hover:bg-base-100/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-100"
				>
					Prendre rendez-vous
				</a>
				<a
					href="/clinique/bonjour"
					class="rounded-full border-2 border-primary-content/40 px-7 py-3 font-semibold text-primary-content transition-colors hover:border-primary-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-content"
				>
					Je suis une clinique
				</a>
			</div>
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="border-t border-base-300 py-10">
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row"
		>
			<div class="flex items-center gap-2">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					class="text-primary"
					aria-hidden="true"
				>
					<path
						d="M2 12h4l2-7 4 14 3-9 2 5h5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span class="font-display font-semibold">eClinique</span>
			</div>
			<p class="text-sm text-base-content/50">© 2026 eClinique. Tous droits réservés.</p>
		</div>
	</footer>
</div>

<style>
	.landing {
		font-family: 'Inter', system-ui, sans-serif;
	}
	.font-display {
		font-family: 'Fraunces', serif;
	}

	.pulse-line path {
		stroke-dasharray: 700;
		stroke-dashoffset: 700;
		animation:
			draw 1.6s ease-out 0.2s forwards,
			glow 2.4s ease-in-out 2s infinite;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes glow {
		0%,
		100% {
			filter: drop-shadow(0 0 0 transparent);
		}
		50% {
			filter: drop-shadow(0 0 6px hsl(var(--p) / 0.4));
		}
	}

	.ticket {
		opacity: 0;
		transform: translateY(16px);
		animation: ticketIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 1.4s forwards;
	}
	@keyframes ticketIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.marquee {
		animation: scroll 28s linear infinite;
	}
	@keyframes scroll {
		to {
			transform: translateX(-50%);
		}
	}

	.spot-card {
		transition: box-shadow 0.3s ease;
	}
	.spot-card:hover {
		box-shadow: 0 20px 45px -20px hsl(var(--p) / 0.25);
	}
	.spot-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			220px circle at var(--x, 50%) var(--y, 50%),
			hsl(var(--p) / 0.12),
			transparent 70%
		);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}
	.spot-card:hover .spot-glow {
		opacity: 1;
	}

	.cta-glow {
		position: absolute;
		inset: -40% -10% auto -10%;
		height: 160%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.14), transparent 60%);
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse-line path,
		.ticket,
		.marquee {
			animation: none !important;
		}
		.pulse-line path {
			stroke-dashoffset: 0;
		}
		.ticket {
			opacity: 1;
			transform: none;
		}
		* {
			transition-duration: 0.01ms !important;
		}
	}
</style>
