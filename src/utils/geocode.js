export const geocodeAddress = async (locationString) => {
  // Kombinirajte lokaciju s "Hrvatska" za bolju preciznost
  const query = encodeURIComponent(`${locationString}, Hrvatska`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "OPGPlatforma/1.0 (didivanovidvori@outlook.com)",
      }, // Ovo je pristojno prema pravilima korištenja API-ja
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name, // Može biti korisno za provjeru
      };
    }
  } catch (error) {
    console.error("Greška pri geokodiranju:", error);
  }
  // Vrati default koordinate za Hrvatsku ako ne uspije
  return { lat: 45.815, lng: 15.9819 };
};
