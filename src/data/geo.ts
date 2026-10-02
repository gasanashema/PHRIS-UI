// Approximate district centroids for schematic maps (x: west→east, y: north→south, both 0–100).
// Positions are illustrative, not survey-grade coordinates.
export const DISTRICT_XY: Record<string, {x: number;y: number;}> = {
  Rusizi: { x: 10, y: 84 },
  Nyamasheke: { x: 14, y: 66 },
  Karongi: { x: 20, y: 50 },
  Rutsiro: { x: 20, y: 36 },
  Rubavu: { x: 15, y: 20 },
  Nyabihu: { x: 26, y: 22 },
  Ngororero: { x: 30, y: 38 },
  Musanze: { x: 34, y: 12 },
  Burera: { x: 46, y: 7 },
  Gakenke: { x: 41, y: 27 },
  Rulindo: { x: 51, y: 25 },
  Gicumbi: { x: 60, y: 14 },
  Nyarugenge: { x: 53, y: 42 },
  Gasabo: { x: 60, y: 35 },
  Kicukiro: { x: 60, y: 46 },
  Muhanga: { x: 41, y: 47 },
  Kamonyi: { x: 48, y: 53 },
  Ruhango: { x: 40, y: 60 },
  Nyanza: { x: 45, y: 68 },
  Huye: { x: 40, y: 78 },
  Gisagara: { x: 49, y: 84 },
  Nyaruguru: { x: 33, y: 90 },
  Nyamagabe: { x: 28, y: 73 },
  Rwamagana: { x: 70, y: 44 },
  Bugesera: { x: 61, y: 63 },
  Ngoma: { x: 76, y: 61 },
  Kirehe: { x: 87, y: 71 },
  Kayonza: { x: 82, y: 40 },
  Gatsibo: { x: 76, y: 24 },
  Nyagatare: { x: 83, y: 9 }
};

// Approximate 2022 census populations (thousands)
export const DISTRICT_POP_K: Record<string, number> = {
  Rusizi: 486, Nyamasheke: 434, Karongi: 375, Rutsiro: 368, Rubavu: 546, Nyabihu: 320, Ngororero: 368,
  Musanze: 476, Burera: 387, Gakenke: 357, Rulindo: 350, Gicumbi: 448,
  Nyarugenge: 374, Gasabo: 880, Kicukiro: 492,
  Muhanga: 358, Kamonyi: 450, Ruhango: 360, Nyanza: 366, Huye: 381, Gisagara: 397, Nyaruguru: 318, Nyamagabe: 371,
  Rwamagana: 484, Bugesera: 551, Ngoma: 404, Kirehe: 460, Kayonza: 457, Gatsibo: 552, Nyagatare: 653
};

export const BORDER_DISTRICTS = ['Rusizi', 'Nyamasheke', 'Karongi', 'Rutsiro', 'Rubavu', 'Musanze', 'Burera', 'Gicumbi', 'Nyagatare', 'Kirehe', 'Bugesera', 'Gisagara', 'Nyaruguru', 'Huye'];

// Demonstration monthly rainfall (mm) — wetter in the west and north-west
export const rainfallFor = (district: string) => {
  const p = DISTRICT_XY[district];
  return p ? Math.round(170 - p.x * 0.8 + (p.y < 30 ? 10 : 0)) : 120;
};
export const facilitiesFor = (district: string) => Math.round((DISTRICT_POP_K[district] ?? 400) / 28);
