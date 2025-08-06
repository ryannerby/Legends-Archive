import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HistoryForm from "./historyForm";
import "./carHistory.css";

const API_BASE = "http://localhost:5001";


type HistoryEvent = {
  _id: string;
  title: string;
  date: string;        
  description: string;
};

type Car = {
  name: string;
  year: string | number;
  chassisNumber: string;
  imageUrl?: string;
  history: HistoryEvent[];
};

function CarHistory() {
  
  const { id } = useParams();

  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!id) setError("No car id provided");
  }, [id]);

  const fetchCar = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/cars/${id}`);
      if (!response.ok) throw new Error("Error fetching car history");
      const data = (await response.json()) as Car; 
      setCar(data);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  async function handleHistoryAdded() {
    await fetchCar();
  }

  async function handleDeleteHistory(eventId: string) {
    try {
      const response = await fetch(`${API_BASE}/cars/${id}/history/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      await fetchCar();
    } catch (err: any) {
      setError(err?.message ?? "Delete failed");
    }
  }

  if (loading) return <p>Loading history...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!car) return <p className="error">No car data.</p>;

  return (
    <div className="history-container">
      <div className="car-details">
        {car.imageUrl && (
          <img
            src={`http://localhost:5001${car.imageUrl}`}
            alt={car.name}
            className="car-image"
          />
        )}
        <div className="title">
          <h1>
            {car.year} {car.name}
          </h1>
          <h3>{car.chassisNumber}</h3>
        </div>
        <div className="history-form">
          <h2>Add History Event</h2>
          <HistoryForm carId={id!} onHistoryAdded={handleHistoryAdded} />
        </div>
      </div>

      <div className="car-history">
        {[...car.history]
          .sort(
            (a: HistoryEvent, b: HistoryEvent) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((event: HistoryEvent) => (
            <li className="history-list" key={event._id}>
              <div className="line">|</div>
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.description}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteHistory(event._id)}
              >
                Delete
              </button>
            </li>
          ))}
      </div>
    </div>
  );
}

export default CarHistory;

