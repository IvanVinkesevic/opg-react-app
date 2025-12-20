// src/components/Select.js - FINALNA VERZIJA
import React from "react";
import { HRVATSKE_ZUPANIJE } from "../utils/zupanije";

function Select(props) {
  return (
    <div className="razmak">
      {/* GRUPA 1: Kategorija */}
      <div className="filter-group">
        <div className="filter-wrapper">
          <label htmlFor="lista-kategorija" className="filter-label">
            Kategorija proizvoda:
          </label>
          <select
            id="lista-kategorija"
            onChange={props.onCategoryChange}
            className="filter-select"
          >
            <option value="">Odaberite kategoriju</option>
            <option value="voće">Voće</option>
            <option value="povrće">Povrće</option>
            <option value="meso">Meso</option>
            <option value="mliječni proizvodi">Mliječni proizvodi</option>
            <option value="med i pčelinji proizvodi">
              Med i pčelinji proizvodi
            </option>
            <option value="riba">Riba</option>
            <option value="prehrambeni proizvodi">Prehrambeni proizvodi</option>
            <option value="piće">Piće</option>
            <option value="ostalo">Ostalo</option>
          </select>
        </div>
      </div>

      {/* GRUPA 2: Županija */}
      <div className="filter-group">
        <div className="filter-wrapper">
          <label htmlFor="lista-lokacija" className="filter-label">
            Županija:
          </label>
          <select
            id="lista-lokacija"
            onChange={props.onLocationChange}
            className="filter-select"
          >
            <option value="0">Sve županije</option>
            {HRVATSKE_ZUPANIJE.map((zupanija, index) => (
              <option key={index} value={zupanija}>
                {zupanija}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Select;
