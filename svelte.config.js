import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		env: {
			// Change this to whatever prefix you want to allow on the client side.
			// Setting it to an empty string "" will allow ALL environment variables 
			// to be potentially exposed (Use with caution!).
			publicPrefix: 'PUBLIC_' 
		}
	}
};

export default config;
