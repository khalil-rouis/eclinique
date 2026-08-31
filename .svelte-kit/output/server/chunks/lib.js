//#region src/lib/index.ts
var clinic_types = [
	"Médecine générale / familiale",
	"Soins d'urgence",
	"Pédiatrique",
	"Gynécologie-obstétrique",
	"Dermatologie",
	"Cardiologie",
	"Orthopédie",
	"Clinique dentaire",
	"Optométrie / soins oculaires",
	"ORL (oto-rhino-laryngologie)",
	"Physiothérapie",
	"Santé mentale / psychiatrie",
	"Endocrinologie",
	"Gastro-entérologie",
	"Neurologie",
	"Oncologie",
	"Urologie",
	"Rhumatologie",
	"Allergologie et d'immunologie",
	"Podologie",
	"Fertilité / médecine reproductive",
	"Médecine du sport",
	"Gestion de la douleur",
	"Soins des plaies",
	"Maladies infectieuses",
	"Néphrologie",
	"Pneumologie",
	"Gériatrie",
	"Vaccination / médecine des voyages",
	"Médecine du travail",
	"Perte de poids / bariatrique",
	"Médecine du sommeil",
	"Chirurgie plastique",
	"Chiropratique",
	"Orthophonie",
	"Santé communautaire",
	"Télémédecine",
	"Clinique sans rendez-vous",
	"Imagerie diagnostique",
	"Don de sang / transfusion"
];
var sha256 = async (message) => {
	const msgBuffer = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
};
var generateSecureHex32 = () => {
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
};
//#endregion
export { generateSecureHex32 as n, sha256 as r, clinic_types as t };
