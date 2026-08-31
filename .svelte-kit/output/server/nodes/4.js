

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/clinique/bonjour/_page.svelte.js')).default;
export const imports = ["entries/pages/clinique/bonjour/_page.svelte.js","chunks/server.js","chunks/state.js","chunks/internal.js","chunks/internal2.js","chunks/client.js","chunks/shared.js","chunks/exports.js"];
export const stylesheets = [];
export const fonts = [];
