

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["entries/pages/_layout.svelte.js","chunks/server.js"];
export const stylesheets = ["_app/immutable/assets/_layout.DraqdGvI.css"];
export const fonts = [];
