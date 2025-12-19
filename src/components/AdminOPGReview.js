function AdminOPGReview() {
  const [pendingOPGs, setPendingOPGs] = useState([]); // Učitaj iz emaila/backenda
  const [approvedOPGs, setApprovedOPGs] = useState([]);

  const approveOPG = (opg) => {
    // 1. Dodaj u JSON
    // 2. Pošalji email OPG-u da je odobren
    // 3. Ukloni s pending liste
  };

  const rejectOPG = (opg, reason) => {
    // Pošalji email s objašnjenjem
  };

  return (
    <div className="admin-panel">
      <h2>Pregled prijava OPG-ova</h2>

      <div className="pending-list">
        <h3>Na čekanju ({pendingOPGs.length})</h3>
        {pendingOPGs.map((opg) => (
          <div key={opg.id} className="opg-card">
            <h4>{opg.name}</h4>
            <p>Lokacija: {opg.location}</p>
            <p>Kategorija: {opg.category}</p>
            <button onClick={() => approveOPG(opg)}>Odobri</button>
            <button onClick={() => rejectOPG(opg, "Nepotpuni podaci")}>
              Odbij
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
