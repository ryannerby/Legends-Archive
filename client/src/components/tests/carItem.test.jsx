//TESTS:
//este test se encarga de que el auto seleccionado se renderize en la UI
//Y ademas tambien comprueba que cuando se presiona view history este se redirige a la pagina de historial del auto

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CarItem from "../carItem";

const car = {
  _id: "123",
  name: "Toyota",
  year: 2020,
  chassisNumber: "ABC123",
  imageUrl: "/toyota.jpg",
};

describe("CarItem", () => {
  test("renders the selected car item", () => {
    render(
      <MemoryRouter>
        <CarItem car={car} />
      </MemoryRouter>
    );

    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  test("has a link to the car history page", () => {
    render(
      <MemoryRouter>
        <CarItem car={car} />
      </MemoryRouter>
    );

    const link = screen.getByText("View history");
    expect(link.closest("a")).toHaveAttribute("href", "/cars/123");
  });
});
