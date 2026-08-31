

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/patient/nouveau/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.BVe9UzsQ.js","_app/immutable/chunks/D8GXnFLj.js","_app/immutable/chunks/Bjl0xSp8.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DFND1UZr.js"];
export const stylesheets = [];
export const fonts = [];
