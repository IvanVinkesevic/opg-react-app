// src/utils/zupanije.js
export const HRVATSKE_ZUPANIJE = [
  "Bjelovarsko-bilogorska",
  "Brodsko-posavska",
  "Dubrovačko-neretvanska",
  "Grad Zagreb",
  "Istarska",
  "Karlovačka",
  "Koprivničko-križevačka",
  "Krapinsko-zagorska",
  "Ličko-senjska",
  "Međimurska",
  "Osječko-baranjska",
  "Požeško-slavonska",
  "Primorsko-goranska",
  "Sisačko-moslavačka",
  "Splitsko-dalmatinska",
  "Varaždinska",
  "Virovitičko-podravska",
  "Vukovarsko-srijemska",
  "Zadarska",
  "Zagrebačka",
  "Šibensko-kninska",
];

export const getZupanijaCoordinates = (zupanija, opcina = "") => {
  // Precizne koordinate za česte lokacije
  const specificLocations = {
    // BBŽ
    "Ivanska, Bjelovarsko-bilogorska": { lat: 45.781, lng: 16.812 },
    "Samarica, Bjelovarsko-bilogorska": { lat: 45.781, lng: 16.812 },
    "Bjelovar, Bjelovarsko-bilogorska": { lat: 45.9, lng: 16.84 },
    "Čazma, Bjelovarsko-bilogorska": { lat: 45.75, lng: 16.61 },
    "Garešnica, Bjelovarsko-bilogorska": { lat: 45.57, lng: 16.94 },
    "Daruvar, Bjelovarsko-bilogorska": { lat: 45.59, lng: 17.23 },

    // Koprivničko-križevačka
    "Koprivnica, Koprivničko-križevačka": { lat: 46.163, lng: 16.832 },
    "Križevci, Koprivničko-križevačka": { lat: 46.022, lng: 16.542 },

    // Zagreb
    "Zagreb, Grad Zagreb": { lat: 45.815, lng: 15.9819 },
  };

  // Provjeri prvo specifičnu lokaciju
  const specificKey = opcina ? `${opcina}, ${zupanija}` : zupanija;
  if (specificLocations[specificKey]) {
    return specificLocations[specificKey];
  }

  // Centri županija
  const zupanijaCenters = {
    "Bjelovarsko-bilogorska": { lat: 45.9, lng: 16.84 },
    "Koprivničko-križevačka": { lat: 46.16, lng: 16.83 },
    Zagrebačka: { lat: 45.49, lng: 16.38 },
    "Grad Zagreb": { lat: 45.815, lng: 15.9819 },
    Varaždinska: { lat: 46.305, lng: 16.337 },
    Međimurska: { lat: 46.39, lng: 16.44 },
    // Dodaj ostale po potrebi...
  };

  return zupanijaCenters[zupanija] || { lat: 45.1, lng: 15.2 };
};
