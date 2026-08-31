import * as server from '../entries/pages/clinique/compte/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/clinique/compte/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/clinique/compte/+page.server.ts";
export const imports = ["entries/pages/clinique/compte/_page.svelte.js","chunks/server.js"];
export const stylesheets = [];
export const fonts = [];
