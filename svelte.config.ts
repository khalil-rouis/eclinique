import adapter from '@sveltejs/adapter-vercel'; // Ensure this points to Vercel

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  }
};

export default config;
