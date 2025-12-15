import { useEffect, useState } from "react";
import Table from "../containers/Table";
import Select from "../containers/Select";

function OPGByCategory() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [selectedLocation, setSelectedLocation] = useState("0");

  useEffect(() => {
    fetch("/data/opg-data.json")
      .then((response) => response.json())
      .then((data) => setAllData(data))
      .catch((error) => setError(error.toString()));
  }, []);

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

  const applyFilters = (category, location) => {
    let filtered = allData;

    if (category !== "0") {
      filtered = filtered.filter((opg) => opg.category === category);
    }

    if (location !== "0") {
      filtered = filtered.filter((opg) => opg.location === location);
    }

    setFilteredData(filtered);
  };

  if (error) return <div>Greška: {error}</div>;

  return (
    <div className="sadrzaj">
      <h1>Pretraga OPG-ova</h1>
      <Select
        onCategoryChange={handleCategoryChange}
        onLocationChange={handleLocationChange}
      />
      {filteredData.length > 0 && <Table podaci={filteredData} />}
      {filteredData.length === 0 && selectedCategory !== "0" && (
        <p>Nema OPG-ova za odabrane kriterije.</p>
      )}
    </div>
  );
}

export default OPGByCategory;
