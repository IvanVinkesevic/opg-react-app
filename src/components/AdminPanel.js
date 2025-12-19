import { useState, useEffect } from "react";
import { geocodeAddress } from "../utils/geocode";
import { HRVATSKE_ZUPANIJE, getZupanijaCoordinates } from "../utils/zupanije";

function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newOPG, setNewOPG] = useState({
    name: "",
    location: "",
    municipality: "",
    category: "",
    products: "",
    contact: "",
    phone: "",
    lat: "",
    lng: "",
  });
  const [allOPGs, setAllOPGs] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false); // ← DODANO za loading state

  const ADMIN_PASSWORD = "akoIRS2026jupi!"; // PROMIJENI OVO!

  useEffect(() => {
    fetch("/data/opg-data.json")
      .then((response) => response.json())
      .then((data) => setAllOPGs(data))
      .catch((error) => console.error("Greška:", error));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Pogrešna lozinka!");
    }
  };

  const addOPG = () => {
    if (!newOPG.name || !newOPG.location || !newOPG.category) {
      alert("Ispunite obavezna polja!");
      return;
    }

    const updatedOPGs = [
      ...allOPGs,
      {
        ...newOPG,
        id: Date.now(),
        products: newOPG.products.split(",").map((p) => p.trim()),
        lat: newOPG.lat || 45.8, // Default ako nije uneseno
        lng: newOPG.lng || 15.9,
      },
    ];

    setAllOPGs(updatedOPGs);

    // Reset forma
    setNewOPG({
      name: "",
      location: "",
      municipality: "",
      category: "",
      products: "",
      contact: "",
      phone: "",
      lat: "",
      lng: "",
    });

    alert("OPG dodan! Ne zaboravite preuzeti JSON.");
  };

  const handleGeocode = async () => {
    if (!newOPG.location) {
      alert("Prvo unesite županiju za geokodiranje.");
      return;
    }

    setIsGeocoding(true); // Počni loading

    try {
      // POKUŠAJ 1: Koristi naše poznate koordinate (najpreciznije)
      const knownCoords = getZupanijaCoordinates(
        newOPG.location,
        newOPG.municipality
      );

      // Ako imamo specifične koordinate za ovu općinu/županiju
      if (newOPG.municipality) {
        // Provjeri da li smo dobili specifične koordinate ili samo centar županije
        const specificKey = `${newOPG.municipality}, ${newOPG.location}`;
        const hasSpecificCoords = specificKey.includes(newOPG.municipality);

        setNewOPG({
          ...newOPG,
          lat: knownCoords.lat.toFixed(6),
          lng: knownCoords.lng.toFixed(6),
        });

        if (hasSpecificCoords) {
          alert(
            `✅ Koordinate za ${newOPG.municipality} (${newOPG.location}):\n` +
              `Lat: ${knownCoords.lat.toFixed(6)}\n` +
              `Lng: ${knownCoords.lng.toFixed(6)}`
          );
        } else {
          alert(
            `ℹ️ Koristim centar županije ${newOPG.location}:\n` +
              `Lat: ${knownCoords.lat.toFixed(6)}\n` +
              `Lng: ${knownCoords.lng.toFixed(6)}\n\n` +
              `(Za preciznije koordinate upišite točan grad/općinu)`
          );
        }

        setIsGeocoding(false);
        return;
      }

      // POKUŠAJ 2: Ako nema općine, koristi OpenStreetMap za županiju
      const locationQuery = `${newOPG.location}, Hrvatska`;
      const osmCoords = await geocodeAddress(locationQuery);

      // Provjeri da li su koordinate unutar Hrvatske
      if (
        osmCoords.lat > 42 &&
        osmCoords.lat < 47 &&
        osmCoords.lng > 13 &&
        osmCoords.lng < 20
      ) {
        setNewOPG({
          ...newOPG,
          lat: osmCoords.lat.toFixed(6),
          lng: osmCoords.lng.toFixed(6),
        });
        alert(
          `✅ Centar županije ${newOPG.location} (preko OpenStreetMap):\n` +
            `Lat: ${osmCoords.lat.toFixed(6)}\n` +
            `Lng: ${osmCoords.lng.toFixed(6)}`
        );
      } else {
        // Ako OSM vrati loše koordinate, koristi naše
        setNewOPG({
          ...newOPG,
          lat: knownCoords.lat.toFixed(6),
          lng: knownCoords.lng.toFixed(6),
        });
        alert(
          `ℹ️ Koristim centar županije ${newOPG.location}:\n` +
            `Lat: ${knownCoords.lat.toFixed(6)}\n` +
            `Lng: ${knownCoords.lng.toFixed(6)}`
        );
      }
    } catch (error) {
      console.error("Greška pri geokodiranju:", error);

      // Fallback: koristi naše koordinate
      const fallbackCoords = getZupanijaCoordinates(
        newOPG.location,
        newOPG.municipality
      );
      setNewOPG({
        ...newOPG,
        lat: fallbackCoords.lat.toFixed(6),
        lng: fallbackCoords.lng.toFixed(6),
      });

      alert(
        `⚠️ Koristim centar županije ${newOPG.location} (fallback):\n` +
          `Lat: ${fallbackCoords.lat.toFixed(6)}\n` +
          `Lng: ${fallbackCoords.lng.toFixed(6)}`
      );
    } finally {
      setIsGeocoding(false);
    }
  };
  const deleteOPG = (id) => {
    if (window.confirm("Jeste li sigurni da želite obrisati ovaj OPG?")) {
      const updatedOPGs = allOPGs.filter((opg) => opg.id !== id);
      setAllOPGs(updatedOPGs);
      alert("OPG obrisan!");
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(allOPGs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "opg-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(
      "✅ JSON fajl preuzet! Zamijenite /public/data/opg-data.json s ovim fajlom."
    );
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
        <h2>Admin Panel</h2>
        <p>Unesite lozinku za pristup:</p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            placeholder="Lozinka"
            required
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Prijava
          </button>
        </form>
        <p style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          Ovo je zaštićena stranica samo za administratora udruge.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Administracija OPG-ova</h2>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>
            Ukupno OPG-ova: <strong>{allOPGs.length}</strong>
          </p>
        </div>
        <div>
          <button
            onClick={downloadJSON}
            style={{
              marginRight: "10px",
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>📥</span> Preuzmi JSON
          </button>
          <button
            onClick={() => {
              if (window.confirm("Jeste li sigurni da želite odjaviti?")) {
                setIsAuthenticated(false);
                setPassword("");
              }
            }}
            style={{
              padding: "10px 15px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Odjava
          </button>
        </div>
      </div>

      {/* FORMA ZA DODAVANJE */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Dodaj novi OPG ručno</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Naziv OPG-a *
            </label>
            <input
              type="text"
              value={newOPG.name}
              onChange={(e) => setNewOPG({ ...newOPG, name: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Županija *
            </label>
            <select
              value={newOPG.location}
              onChange={(e) =>
                setNewOPG({ ...newOPG, location: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            >
              <option value="">Odaberite županiju</option>
              {HRVATSKE_ZUPANIJE.map((zupanija, index) => (
                <option key={index} value={zupanija}>
                  {zupanija}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Općina/selo (opcionalno)
            </label>
            <input
              type="text"
              value={newOPG.municipality}
              onChange={(e) =>
                setNewOPG({ ...newOPG, municipality: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="Npr: Ivanska, Bjelovar..."
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Kategorija *
            </label>
            <select
              value={newOPG.category}
              onChange={(e) =>
                setNewOPG({ ...newOPG, category: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            >
              <option value="">Odaberi kategoriju...</option>
              <option value="Voće">Voće</option>
              <option value="Povrće">Povrće</option>
              <option value="Mliječni">Mliječni proizvodi</option>
              <option value="Med">Med i pčelinji proizvodi</option>
              <option value="Meso">Meso i prerađevine</option>
              <option value="Žitarice">Žitarice i brašno</option>
              <option value="Ostalo">Ostalo</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Kontakt email *
            </label>
            <input
              type="email"
              value={newOPG.contact}
              onChange={(e) =>
                setNewOPG({ ...newOPG, contact: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="opg@email.hr"
              required
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Telefon (opcionalno)
            </label>
            <input
              type="tel"
              value={newOPG.phone}
              onChange={(e) => setNewOPG({ ...newOPG, phone: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="091/123/456"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Koordinate
            </label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                value={newOPG.lat}
                onChange={(e) => setNewOPG({ ...newOPG, lat: e.target.value })}
                placeholder="Lat (npr: 45.815)"
                style={{
                  width: "50%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                value={newOPG.lng}
                onChange={(e) => setNewOPG({ ...newOPG, lng: e.target.value })}
                placeholder="Lng (npr: 15.9819)"
                style={{
                  width: "50%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* GUMB ZA GEOKODIRANJE - OVO JE KLJUČNO! */}
            <button
              type="button"
              onClick={handleGeocode}
              disabled={isGeocoding || !newOPG.location}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: !newOPG.location
                  ? "#ccc"
                  : isGeocoding
                  ? "#ff9800"
                  : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor:
                  !newOPG.location || isGeocoding ? "not-allowed" : "pointer",
                fontSize: "14px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isGeocoding ? (
                <>⏳ Dohvaćam koordinate...</>
              ) : !newOPG.location ? (
                <>🗺️ Odaberite županiju prvo</>
              ) : (
                <>🗺️ Dohvati koordinate automatski</>
              )}
            </button>

            <p
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "8px",
                lineHeight: "1.4",
              }}
            >
              <strong>Uputa:</strong> Odaberite županiju (i općinu), pa kliknite
              gumb. Koordinate će se automatski popuniti. Provjerite točnost na
              karti.
            </p>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Proizvodi *
            </label>
            <input
              type="text"
              value={newOPG.products}
              onChange={(e) =>
                setNewOPG({ ...newOPG, products: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="jabuke, kruške, šljive (odvojite zarezom)"
              required
            />
            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Odvojite proizvode zarezom
            </p>
          </div>
        </div>

        <button
          onClick={addOPG}
          style={{
            padding: "12px 24px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          ➕ Dodaj novi OPG
        </button>
      </div>

      {/* LISTA POSTOJEĆIH OPG-OVA */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0 }}>Postojeći OPG-ovi ({allOPGs.length})</h3>
          {allOPGs.length > 0 && (
            <div style={{ fontSize: "14px", color: "#666" }}>
              <span>Kliknite "Preuzmi JSON" nakon promjena</span>
            </div>
          )}
        </div>

        {allOPGs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "18px", color: "#666" }}>
              Nema OPG-ova u bazi podataka.
            </p>
            <p>Dodajte prvi OPG pomoću forme iznad.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            {allOPGs.map((opg) => (
              <div
                key={opg.id}
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "20px",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "18px",
                        color: "#333",
                      }}
                    >
                      {opg.name}
                      {opg.lat && opg.lng && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#4CAF50",
                            marginLeft: "10px",
                          }}
                        >
                          ✓ na karti
                        </span>
                      )}
                    </h4>

                    <div style={{ marginBottom: "10px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "3px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            minWidth: "80px",
                          }}
                        >
                          <strong>Županija:</strong>
                        </span>
                        <span style={{ fontSize: "14px", color: "#333" }}>
                          {opg.location}
                        </span>
                      </div>
                      {opg.municipality && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "3px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              minWidth: "80px",
                            }}
                          >
                            <strong>Općina:</strong>
                          </span>
                          <span style={{ fontSize: "14px", color: "#333" }}>
                            {opg.municipality}
                          </span>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "3px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            minWidth: "80px",
                          }}
                        >
                          <strong>Kategorija:</strong>
                        </span>
                        <span style={{ fontSize: "14px", color: "#333" }}>
                          {opg.category}
                        </span>
                      </div>
                      {opg.lat && opg.lng && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "3px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              minWidth: "80px",
                            }}
                          >
                            <strong>Koordinate:</strong>
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              fontFamily: "monospace",
                            }}
                          >
                            {opg.lat}, {opg.lng}
                          </span>
                        </div>
                      )}
                    </div>

                    {opg.contact && (
                      <div style={{ marginBottom: "5px" }}>
                        <span style={{ fontSize: "14px", color: "#666" }}>
                          <strong>Kontakt:</strong> {opg.contact}
                        </span>
                      </div>
                    )}
                    {opg.phone && (
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontSize: "14px", color: "#666" }}>
                          <strong>Telefon:</strong> {opg.phone}
                        </span>
                      </div>
                    )}

                    {opg.products && (
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "5px",
                          }}
                        >
                          <strong>Proizvodi:</strong>
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#333",
                            lineHeight: "1.5",
                          }}
                        >
                          {Array.isArray(opg.products)
                            ? opg.products.join(", ")
                            : opg.products}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteOPG(opg.id)}
                    style={{
                      backgroundColor: "#ffebee",
                      color: "#d32f2f",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginLeft: "10px",
                    }}
                  >
                    🗑️ Obriši
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
