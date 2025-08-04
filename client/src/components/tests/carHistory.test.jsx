//TESTS:
//it renders the car data when the API responds
//it shows an error if the API fails
//it can add and delete events for the car
//if you want to add a new event and there is nothing entered by the client, nothing is added lol  

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CarHistory from "../carHistory";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
}));

describe("CarHistory", () => {
  test("Loading while loading", () => {
    global.fetch = jest.fn();
    render(<CarHistory />);
    expect(screen.getByText(/Loading history.../i)).toBeInTheDocument();
  });

  test("Shows error if the API fails", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    render(<CarHistory />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  test("Shows the car data when the API responds", async () => {
    const mockCar = {
      name: "Toyota",
      year: 2020,
      chassisNumber: "ABC123",
      imageUrl: "",
      history: [
        { _id: "1", title: "Oil Change", date: "2022-01-01", description: "new oil" },
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCar),
      })
    );

    render(<CarHistory />);

    await waitFor(() => {
      expect(screen.getByText(/2020 Toyota/)).toBeInTheDocument();
      expect(screen.getByText(/Oil Change/)).toBeInTheDocument();
    });
  });
});

  