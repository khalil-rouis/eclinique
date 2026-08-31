

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["entries/pages/_page.svelte.js","chunks/server.js"];
export const stylesheets = [];
export const fonts = [];
