import { useState } from "react";
import { HRVATSKE_ZUPANIJE } from "../utils/zupanije";

function OPGRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    municipality: "", // Općina/selo
    category: "",
    products: "",
    contact: "",
    phone: "",
    description: "",
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Formspree FORM ID - koristi tvoj pravi ID
  const FORMSPREE_ID = "mvzpobep"; // Zamijeni ako treba

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Formspree zahtijeva FormData format
    const formDataToSend = new FormData();

    // Dodaj sve podatke
    formDataToSend.append(
      "_subject",
      "NOVA OPG PRIJAVA - Udruga za revitalizaciju sela"
    );
    formDataToSend.append("name", formData.name);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("municipality", formData.municipality || "");
    formDataToSend.append("category", formData.category);
    formDataToSend.append("products", formData.products);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("phone", formData.phone || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("consent", formData.consent ? "DA" : "NE");
    formDataToSend.append("_replyto", formData.contact);
    formDataToSend.append("_language", "hr");

    // Pošalji putem Formspree
    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      body: formDataToSend,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setSubmitted(true);

          // Reset forme nakon uspješnog slanja
          setFormData({
            name: "",
            location: "",
            municipality: "",
            category: "",
            products: "",
            contact: "",
            phone: "",
            description: "",
            consent: false,
          });
        } else {
          throw new Error("Došlo je do greške pri slanju forme");
        }
      })
      .catch((error) => {
        console.error("Greška:", error);
        setError(
          "Došlo je do greške pri slanju. Molimo pokušajte ponovno kasnije."
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (submitted) {
    return (
      <div className="sadrzaj" style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#4CAF50" }}>Hvala na prijavi! 🎉</h2>
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
          Vaša prijava je uspješno zaprimljena.
        </p>
        <div
          style={{
            backgroundColor: "#f0f8ff",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Što sljedi?</h3>
          <ol style={{ lineHeight: "1.8" }}>
            <li>
              <strong>Provjera podataka:</strong> Kontaktirat ćemo vas u roku od
              48 sati za provjeru podataka.
            </li>
            <li>
              <strong>Objava na stranici:</strong> Nakon provjere, vaš OPG će
              biti vidljiv na našoj stranici.
            </li>
            <li>
              <strong>Potvrda emaila:</strong> Na vašu email adresu poslana je
              automatska potvrda prijave.
            </li>
          </ol>
          <p style={{ marginTop: "20px", fontStyle: "italic" }}>
            Udruga "Inicijativa za revitalizaciju hrvatskog sela"
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Pošalji novu prijavu
        </button>
      </div>
    );
  }

  return (
    <div className="sadrzaj" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Prijavite svoj OPG u našu bazu</h1>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <p style={{ fontSize: "16px", lineHeight: "1.6", margin: 0 }}>
          <strong>Besplatna promocija za lokalne OPG-ove!</strong> Prijavite se
          i povećajte vidljivost vašeg OPG-a u okolici Samarića, Ivanske,
          Bjelovarsko-bilogorske županije i šire.
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <strong>Greška:</strong> {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Naziv OPG-a */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Naziv OPG-a *
          </label>
          <input
            type="text"
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Npr: OPG Ivica, OPG Zeleni raj..."
          />
        </div>

        {/* Županija */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Županija *
          </label>
          <select
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: "white",
            }}
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          >
            <option value="">Odaberite županiju</option>
            {HRVATSKE_ZUPANIJE.map((zupanija, index) => (
              <option key={index} value={zupanija}>
                {zupanija}
              </option>
            ))}
          </select>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Odaberite županiju u kojoj se nalazi vaš OPG.
          </p>
        </div>

        {/* Općina/selo */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Općina i selo *
          </label>
          <input
            type="text"
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
            value={formData.municipality}
            onChange={(e) =>
              setFormData({ ...formData, municipality: e.target.value })
            }
            placeholder="Npr: Ivanska, selo Samarica ili Bjelovar"
          />
          <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Navedite općinu i selo/grad gdje se nalazite. Ovo nam pomaže točnije
            pozicionirati vas na karti.
          </p>
        </div>

        {/* Kategorija */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Glavna kategorija proizvoda *
          </label>
          <select
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: "white",
            }}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Odaberite kategoriju</option>
            <option value="Voće">Voće</option>
            <option value="Povrće">Povrće</option>
            <option value="Mliječni proizvodi">Mliječni proizvodi</option>
            <option value="Meso i prerađevine">Meso i prerađevine</option>
            <option value="Med i pčelinji proizvodi">
              Med i pčelinji proizvodi
            </option>
            <option value="Žitarice i brašno">Žitarice i brašno</option>
            <option value="Pića (sokovi, rakije)">Pića (sokovi, rakije)</option>
            <option value="Ostalo">Ostalo</option>
          </select>
        </div>

        {/* Proizvodi */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Koje proizvode nudite? *
          </label>
          <textarea
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
              minHeight: "100px",
              resize: "vertical",
            }}
            value={formData.products}
            onChange={(e) =>
              setFormData({ ...formData, products: e.target.value })
            }
            placeholder="Navedite sve proizvode koje nudite, odvojene zarezom. Npr: jabuke, kruške, šljive, domaći sir, med, čvarci, rakija od šljiva..."
          />
          <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Budite što precizniji. Navedite sve proizvode koje imate u ponudi.
          </p>
        </div>

        {/* Kontakt informacije */}
        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            Kontakt informacije
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Email adresa *
            </label>
            <input
              type="email"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              placeholder="vas-opg@email.hr"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Telefon (opcionalno)
            </label>
            <input
              type="tel"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="091/123/456"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Kratki opis vašeg OPG-a (opcionalno)
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box",
                minHeight: "80px",
                resize: "vertical",
              }}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Napišite nešto o vašem OPG-u, tradiciji, načinu proizvodnje..."
            />
          </div>
        </div>

        {/* Consent */}
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              required
              checked={formData.consent}
              onChange={(e) =>
                setFormData({ ...formData, consent: e.target.checked })
              }
              style={{ marginRight: "10px", marginTop: "4px" }}
            />
            <span style={{ fontSize: "16px", lineHeight: "1.5" }}>
              <strong>
                Slažem se da moji podaci budu javno dostupni na web stranici
                udruge.
              </strong>
              <br />
              Vaše ime, lokacija, kategorija proizvoda i kontakt informacije bit
              će vidljivi svim posjetiteljima stranice u svrhu promocije vašeg
              OPG-a.
            </span>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: isSubmitting ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {isSubmitting ? (
            <>
              <span>⏳</span> Šaljem prijavu...
            </>
          ) : (
            <>
              <span>📝</span> Pošalji prijavu
            </>
          )}
        </button>
      </form>

      {/* Info box */}
      <div
        style={{
          marginTop: "30px",
          padding: "25px",
          backgroundColor: "#e8f4fd",
          borderRadius: "8px",
          borderLeft: "4px solid #2196F3",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#0d47a1" }}>Zašto se prijaviti?</h3>
        <ul
          style={{ fontSize: "16px", lineHeight: "1.8", paddingLeft: "20px" }}
        >
          <li>
            <strong>Besplatna promocija</strong> - Potpuno besplatno za sve
            OPG-ove
          </li>
          <li>
            <strong>Lokalna vidljivost</strong> - Povećajte prodaju lokalnim
            kupcima
          </li>
          <li>
            <strong>Podrška zajednici</strong> - Doprinesite revitalizaciji
            hrvatskog sela
          </li>
          <li>
            <strong>Jednostavna prijava</strong> - Samo jednom ispunite ovu
            formu
          </li>
          <li>
            <strong>Bez obveza</strong> - Možete zatražiti uklanjanje podataka u
            bilo kojem trenutku
          </li>
        </ul>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#bbdefb",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Napomena:</strong> Sve prijave ručno provjeravamo prije
            objave. Kontaktirat ćemo vas na navedenu email adresu za potvrdu
            podataka.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OPGRegistration;
