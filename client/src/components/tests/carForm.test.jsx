//TESTS:
//se renderiza el formulario de creacion del carro
//se puede agregar un carro nuevo
//si no se agrega un carro nuevo se muestra un alert

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CarForm from "../carForm";

describe("CarForm component", () => {
  test("renders form fields correctly", () => {
    render(<CarForm onAddCar={jest.fn()} />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Build year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chassis number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image/i)).toBeInTheDocument();
  });

  test("calls onAddCar with form data when submitted", async () => {
    const mockOnAddCar = jest.fn().mockResolvedValue({ success: true });

    render(<CarForm onAddCar={mockOnAddCar} />);

    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Toyota" } });
    fireEvent.change(screen.getByLabelText(/Build year/i), { target: { value: "2020" } });
    fireEvent.change(screen.getByLabelText(/Chassis number/i), { target: { value: "ABC123" } });

    fireEvent.submit(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(mockOnAddCar).toHaveBeenCalledTimes(1);
    });
  });

  test("shows alert if fields are empty", () => {
    const mockOnAddCar = jest.fn();
    window.alert = jest.fn(); 

    render(<CarForm onAddCar={mockOnAddCar} />);

    fireEvent.submit(screen.getByRole("button", { name: /Create/i }));

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
    expect(mockOnAddCar).not.toHaveBeenCalled();
  });
});
