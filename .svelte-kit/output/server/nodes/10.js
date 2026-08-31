

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/patient/nouveau/_page.svelte.js')).default;
export const imports = ["entries/pages/patient/nouveau/_page.svelte.js","chunks/server.js","chunks/navigation.js","chunks/client.js","chunks/internal.js","chunks/internal2.js","chunks/shared.js","chunks/exports.js"];
export const stylesheets = [];
export const fonts = [];
