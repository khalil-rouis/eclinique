export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["arrow.svg","bg.svg","loading.svg","robots.txt","unverified.svg"]),
	mimeTypes: {".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: null,
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/clinique/aurevoire",
				pattern: /^\/clinique\/aurevoire\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/clinique/bonjour",
				pattern: /^\/clinique\/bonjour\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: __memo(() => import('./entries/endpoints/clinique/bonjour/_server.ts.js'))
			},
			{
				id: "/clinique/compte",
				pattern: /^\/clinique\/compte\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/clinique/nouveau",
				pattern: /^\/clinique\/nouveau\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: __memo(() => import('./entries/endpoints/clinique/nouveau/_server.ts.js'))
			},
			{
				id: "/patient/aurevoire",
				pattern: /^\/patient\/aurevoire\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/patient/bonjour",
				pattern: /^\/patient\/bonjour\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: __memo(() => import('./entries/endpoints/patient/bonjour/_server.ts.js'))
			},
			{
				id: "/patient/compte",
				pattern: /^\/patient\/compte\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/patient/nouveau",
				pattern: /^\/patient\/nouveau\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: __memo(() => import('./entries/endpoints/patient/nouveau/_server.ts.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
