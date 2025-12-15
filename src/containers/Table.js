function Table(props) {
  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Naziv OPG-a</th>
            <th>Lokacija</th>
            <th>Kategorija</th>
            <th>Proizvodi</th>
            <th>Kontakt</th>
          </tr>
        </thead>
        <tbody>
          {props.podaci.map(
            ({ id, name, location, category, products, contact }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{location}</td>
                <td>{category}</td>
                <td>{products.join(", ")}</td>
                <td>{contact}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Table;
