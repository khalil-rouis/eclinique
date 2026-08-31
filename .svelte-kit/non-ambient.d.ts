
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/clinique" | "/clinique/aurevoire" | "/clinique/bonjour" | "/clinique/compte" | "/clinique/nouveau" | "/patient" | "/patient/aurevoire" | "/patient/bonjour" | "/patient/compte" | "/patient/nouveau";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/clinique": Record<string, never>;
			"/clinique/aurevoire": Record<string, never>;
			"/clinique/bonjour": Record<string, never>;
			"/clinique/compte": Record<string, never>;
			"/clinique/nouveau": Record<string, never>;
			"/patient": Record<string, never>;
			"/patient/aurevoire": Record<string, never>;
			"/patient/bonjour": Record<string, never>;
			"/patient/compte": Record<string, never>;
			"/patient/nouveau": Record<string, never>
		};
		Pathname(): "/" | "/clinique/aurevoire" | "/clinique/bonjour" | "/clinique/compte" | "/clinique/nouveau" | "/patient/aurevoire" | "/patient/bonjour" | "/patient/compte" | "/patient/nouveau";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/arrow.svg" | "/bg.svg" | "/loading.svg" | "/robots.txt" | "/unverified.svg" | string & {};
	}
}