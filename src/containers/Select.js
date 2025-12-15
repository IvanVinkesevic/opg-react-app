import React from "react";

function Select(props) {
  return (
    <div className="razmak">
      <label htmlFor="lista-kategorija">Kategorija proizvoda: </label>
      <select id="lista-kategorija" onChange={props.onCategoryChange}>
        <option value="0">Odaberite kategoriju </option>
        <option value="voće">Voće</option>
        <option value="povrće">Povrće</option>
        <option value="mliječni">Mliječni proizvodi</option>
        <option value="meso">Meso i prerađevine</option>
        <option value="med">Med</option>
        <option value="žitarice">Žitarice</option>
      </select>

      {/* NOVI select za lokaciju */}
      <label htmlFor="lista-lokacija">Lokacija: </label>
      <select id="lista-lokacija" onChange={props.onLocationChange}>
        <option value="0">Sve lokacije</option>
        <option value="Zagrebačka županija">Zagrebačka županija</option>
        <option value="Slavonski Brod">Slavonski Brod</option>
        <option value="Istra">Istra</option>
        <option value="Dalmacija">Dalmacija</option>
        <option value="Like">Like</option>
        {/* Dodaj još prema potrebi */}
      </select>
    </div>
  );
}
export default Select;
