// src/components/Select.js
import React from "react";
import { HRVATSKE_ZUPANIJE } from "../utils/zupanije";

function Select(props) {
  return (
    <div className="razmak" style={{ margin: "20px 0" }}>
      {/* Filter po kategoriji */}
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="lista-kategorija"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Kategorija proizvoda:
        </label>
        <select
          id="lista-kategorija"
          onChange={props.onCategoryChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="0">Sve kategorije</option>
          <option value="Voće">Voće</option>
          <option value="Povrće">Povrće</option>
          <option value="Mliječni">Mliječni proizvodi</option>
          <option value="Meso">Meso i prerađevine</option>
          <option value="Med">Med</option>
          <option value="Žitarice">Žitarice</option>
          <option value="Ostalo">Ostalo</option>
        </select>
      </div>

      {/* Filter po županiji */}
      <div>
        <label
          htmlFor="lista-lokacija"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Županija:
        </label>
        <select
          id="lista-lokacija"
          onChange={props.onLocationChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="0">Sve županije</option>
          {HRVATSKE_ZUPANIJE.map((zupanija, index) => (
            <option key={index} value={zupanija}>
              {zupanija}
            </option>
          ))}
        </select>
      </div>

      {/* Info tekst */}
      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#f0f8ff",
          borderRadius: "4px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Napomena:</strong> Sada pretražujete po službenim županijama
          Hrvatske. Za precizniju lokaciju koristite kartu ispod.
        </p>
      </div>
    </div>
  );
}

export default Select;
