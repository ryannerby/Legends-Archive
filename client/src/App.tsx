import React, { useState, useEffect } from "react";
import rccLogo from "./assets/finallogo.jpg";
import "./App.css";
import CarForm from "./components/carForm";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CarHistory from "./components/carHistory";

const API_BASE = "http://localhost:5001";
type Car = {
  _id: string;
  name: string;
  year: string | number;
  chassisNumber: string;
  imageUrl?: string;
  createdAt?: string;
};

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCars() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cars`);
      if (!response.ok) throw new Error("Error fetching cars");
      const data = (await response.json()) as Car[];
      setCars(data);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);

  async function onAddCar(
    carData: FormData
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/cars`, {
        method: "POST",
        body: carData,
      });
      if (res.ok) {
        fetchCars();
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (err: any) {
      return { success: false, message: err?.message ?? "Network error" };
    }
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar__logo">
            <img src={rccLogo} alt="RCC Logo" />
          </div>
          <div className="navbar__links">
            <ul>
              <li>
                <a className="nav-link1" href="http://localhost:5173/">
                  HOME
                </a>
              </li>
              <li>
                <a
                  className="nav-link2"
                  href="https://www.racecar-classifieds.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RACECARS FOR SALE
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="column">
                  <div className="content">
                    <h1>The new way to track old racecars</h1>
                    <p>
                      Track everything from rebuilds to inspections, all the way
                      to FIA HTP's. All in one place.
                    </p>
                    <p>
                      Legends Archive enables you to build a comprehensive
                      history file for your car. It can be passed on during a
                      sale, shared during the advertising phase, or just filled
                      in and cherished
                    </p>
                  </div>

                  <div className="createForm">
                    <CarForm onAddCar={onAddCar} />
                  </div>
                </div>

                <div className="cars carList" id="carList">
                  <h3>Recent cars</h3>
                  {loading && <p>Loading cars...</p>}
                  {error && <p className="error">Error: {error}</p>}

                  <div className="carCardsRow">
                    {[...cars]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt ?? 0).getTime() -
                          new Date(a.createdAt ?? 0).getTime()
                      )
                      .map((car) => (
                        <Link key={car._id} to={`/cars/${car._id}`}>
                          <CarCard car={car} />
                        </Link>
                      ))}
                  </div>
                </div>
              </>
            }
          />
          <Route path="/cars/:id" element={<CarHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

function CarCard({ car }: { car: Car }) {
  return (
    <div className="car-card">
      {car.imageUrl && (
        <img
          src={`http://localhost:5001${car.imageUrl}`}
          alt={car.name}
          className="car-image"
        />
      )}
      <div className="carName">{car.name}</div>
      <div className="carYear">{car.year}</div>
      <div className="carChassis">#{car.chassisNumber}</div>
    </div>
  );
}

export default App;

