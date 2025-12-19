// App.js - KONAČNA VERZIJA
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AllOPGs from "./components/AllOPGs";
import OPGByCategory from "./components/OPGByCategory";
import Contact from "./components/Contact";
import OPGRegistration from "./components/OPGRegistration"; // ← DODAJ OVO
import AdminPanel from "./components/AdminPanel";

import { HRVATSKE_ZUPANIJE, getZupanijaCoordinates } from "./utils/zupanije";
console.log(HRVATSKE_ZUPANIJE.length); // Treba biti 21
console.log(getZupanijaCoordinates("Bjelovarsko-bilogorska")); // Treba vratiti koordinate

function App() {
  return (
    <BrowserRouter>
      <div>
        <header className="app-header">
          <div className="header-content">
            <a
              href="https://ivanvinkesevic.github.io/DidIvanovidvori/"
              style={{ marginLeft: "20px", color: "white" }}
            >
              ← Povratak na glavnu stranicu
            </a>
            <img
              src="/irs-logo2.png"
              alt="OPG Platforma Logo"
              className="logo"
            />
            <h1>
              OPG Platforma -<span> DidIvanovidvori</span>{" "}
            </h1>
          </div>
        </header>
        <nav>
          <ul>
            <li>
              <Link to="/">Svi OPG-ovi</Link>
            </li>
            <li>
              <Link to="/proizvodjaci">Prema kategoriji</Link>
            </li>
            <li>
              <Link to="/prijava-opg">Prijavi svoj OPG</Link> {/* ← DODAJ */}
            </li>
            <li>
              <Link to="/kontakt">Kontakt</Link>
            </li>
            <li style={{ marginLeft: "auto" }}>
              <Link to="/admin" style={{ color: "#ff6b6b", fontSize: "14px" }}>
                🔒 Admin
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<AllOPGs />} />
          <Route path="/proizvodjaci" element={<OPGByCategory />} />
          <Route path="/prijava-opg" element={<OPGRegistration />} />{" "}
          {/* ← DODAJ */}
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
