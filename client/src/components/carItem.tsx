import React from "react";
import { Link } from "react-router-dom";

export default function CarItem({
  car,
}: {
  car: {
    _id: string;
    name: string;
    year: string | number;
    chassisNumber: string;
    imageUrl?: string; 
  };
}) {
  return (
    <li className="car-card">
      {car.imageUrl && (
        <img
          src={`http://localhost:5001${car.imageUrl}`}
          alt={car.name}
          className="car-image"
        />
      )}

      <h2>{car.name}</h2>

      <p>{car.year}</p>
      <p>{car.chassisNumber}</p>
      <div>
        <Link to={`/cars/${car._id}`}>
          <p>View history</p>
        </Link>
      </div>
    </li>
  );
}
