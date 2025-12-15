import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AllOPGs from "./components/AllOPGs";
import OPGByCategory from "./components/OPGByCategory";
import Contact from "./components/Contact";

function App() {
  return (
    <BrowserRouter>
      <div>
        <header className="app-header">
          <div className="header-content">
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
              <Link to="/kontakt">Kontakt</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/opg-app/" element={<AllOPGs />} />
          <Route path="/proizvodjaci" element={<OPGByCategory />} />
          <Route path="/kontakt" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
