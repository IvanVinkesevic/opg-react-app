import { useEffect, useState } from "react";
import Table from "../containers/Table";
import Select from "../components/Select";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Popravi ikone za markere
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function OPGByCategory() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [selectedLocation, setSelectedLocation] = useState("0");

  // SAMO JEDAN useEffect!
  useEffect(() => {
    setIsLoading(true);
    fetch("/data/opg-data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // OVO JE KLJUČNO: Ako OPG već ima lat/lng, koristi te koordinate
        // Ako nema, koristi default za Hrvatsku
        const saKoordinatama = data.map((opg) => {
          // Ako OPG već ima koordinate u JSON-u, koristi ih
          if (opg.lat && opg.lng) {
            return opg;
          }
          // Inače, default koordinate za Hrvatsku
          return {
            ...opg,
            lat: opg.lat || 45.8,
            lng: opg.lng || 15.9,
          };
        });

        setAllData(saKoordinatama);
        setFilteredData(saKoordinatama);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.toString());
        setIsLoading(false);
        console.error("Greška pri učitavanju podataka:", error);
      });
  }, []); // Prazan dependency array = pokreće se samo jednom

  const applyFilters = (category, location) => {
    let filtered = allData;

    if (category !== "0") {
      filtered = filtered.filter((opg) => opg.category === category);
    }

    if (location !== "0") {
      // VAŽNO: Sada pretražujemo po županiji (location polje u JSON-u treba biti županija)
      filtered = filtered.filter((opg) => opg.location === location);
    }

    setFilteredData(filtered);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    applyFilters(category, selectedLocation);
  };

  const handleLocationChange = (event) => {
    const location = event.target.value;
    setSelectedLocation(location);
    applyFilters(selectedCategory, location);
  };

  if (isLoading) {
    return (
      <div className="sadrzaj" style={{ textAlign: "center", padding: "40px" }}>
        <h2>Učitavanje podataka...</h2>
        <p>Molimo pričekajte.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="sadrzaj"
        style={{ textAlign: "center", padding: "40px", color: "red" }}
      >
        <h2>Došlo je do greške</h2>
        <p>{error}</p>
        <p>
          Provjerite da li postoji <code>/public/data/opg-data.json</code> fajl.
        </p>
      </div>
    );
  }

  return (
    <div className="sadrzaj">
      <h1>Pretraga OPG-ova</h1>

      <Select
        onCategoryChange={handleCategoryChange}
        onLocationChange={handleLocationChange}
      />

      {filteredData.length > 0 && (
        <div style={{ margin: "15px 0", color: "#666", fontSize: "16px" }}>
          <strong>Pronađeno {filteredData.length} OPG-ova</strong>
          {filteredData.length <= 5 && " (karta je dostupna ispod)"}
        </div>
      )}

      {filteredData.length > 0 ? (
        <>
          <Table podaci={filteredData} />

          {/* KARTA - prikazuje se samo ako ima 5 ili manje rezultata */}
          {filteredData.length <= 5 && (
            <div className="map-container" style={{ marginTop: "30px" }}>
              <h3>OPG-ovi na karti</h3>
              <div
                style={{
                  height: "400px",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <MapContainer
                  center={[45.8, 15.9]}
                  zoom={7}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredData.map((opg, index) => (
                    <Marker key={opg.id || index} position={[opg.lat, opg.lng]}>
                      <Popup>
                        <div style={{ minWidth: "200px" }}>
                          <h4 style={{ margin: "0 0 5px 0" }}>{opg.name}</h4>
                          <p style={{ margin: "0 0 3px 0" }}>
                            <strong>Lokacija:</strong> {opg.location}
                          </p>
                          {opg.municipality && (
                            <p style={{ margin: "0 0 3px 0" }}>
                              <strong>Općina:</strong> {opg.municipality}
                            </p>
                          )}
                          <p style={{ margin: "0 0 3px 0" }}>
                            <strong>Kategorija:</strong> {opg.category}
                          </p>
                          {opg.contact && (
                            <p
                              style={{ margin: "10px 0 0 0", fontSize: "12px" }}
                            >
                              <em>Kontakt: {opg.contact}</em>
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                *Karta se automatski prikazuje kada ima 5 ili manje rezultata
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h3>Nema rezultata</h3>
          <p>Nema OPG-ova za odabrane kriterije.</p>
          <p>Pokušajte promijeniti filtere.</p>
        </div>
      )}
    </div>
  );
}

export default OPGByCategory;
