import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HistoryForm from './historyForm';
import './carHistory.css';

const API_BASE = "http://localhost:5001";

function CarHistory() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCar = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cars/${id}`);
      if (!response.ok) throw new Error("Error fetching car history");
      const data = await response.json();
      setCar(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  async function handleHistoryAdded() {
    await fetchCar();
  }

  async function handleDeleteHistory(eventId) {
    try {
      const response = await fetch(`${API_BASE}/cars/${id}/history/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      await fetchCar();
    } catch (err) {
      setError(err.message);
    }
  }


 if (loading) return <p>Loading history...</p>;
 if (error) return <p className="error">Error: {error}</p>;

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
          <h1>{car.year} {car.name}</h1>
          <h3>{car.chassisNumber}</h3>
        </div>
        <div className="history-form">
          <h2>Add History Event</h2>
          <HistoryForm carId={id} onHistoryAdded={handleHistoryAdded} />
        </div>
      </div>
      <div className="car-history">
        {[...car.history]
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
          .map((event) => (
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