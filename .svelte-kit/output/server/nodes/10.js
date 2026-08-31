

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/patient/nouveau/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.7dpu_Sg-.js","_app/immutable/chunks/D8GXnFLj.js","_app/immutable/chunks/DlbZIw1M.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/B-9tuWBl.js"];
export const stylesheets = [];
export const fonts = [];
