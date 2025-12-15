import { useEffect, useState } from "react";
import Table from "../containers/Table";

function AllOPGs() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/opg-data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.toString()));
  }, []);

  if (error) return <div>Greška: {error}</div>;
  if (data.length === 0) return <div>Učitavanje podataka...</div>;

  return (
    <div className="sadrzaj">
      <h1>Svi OPG-ovi</h1>
      <Table podaci={data} />
    </div>
  );
}

export default AllOPGs;
