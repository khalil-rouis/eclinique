

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/patient/nouveau/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.CBjr6Hrd.js","_app/immutable/chunks/CXeYPkFo.js","_app/immutable/chunks/Bg8ZwqsV.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BNmv2ksy.js"];
export const stylesheets = [];
export const fonts = [];
