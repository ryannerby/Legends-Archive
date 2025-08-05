//TESTS
//renders homepage
//renders home page text
//navigates correctly to /cars/:id and renders the car history
// All of the componets are passing the tests (the whole page is running)

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../App";


beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith("/cars")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              _id: "123",
              name: "McLaren MP4/4",
              year: "1988",
              chassisNumber: "45345",
              createdAt: "2023-01-01T00:00:00.000Z",
              history: [],
            },
          ]),
      });
    }

    if (url.endsWith("/cars/123")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            _id: "123",
            name: "McLaren MP4/4",
            year: "1988",
            chassisNumber: "45345",
            history: [],
          }),
      });
    }

    return Promise.reject(new Error("Unknown API call"));
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("App renders without crashing and mounts all major components", async () => {
  render(<App />);

  
  expect(screen.getByText(/The new way to track old racecars/i)).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /rcc logo/i })).toBeInTheDocument();


  await waitFor(() => {
    expect(screen.getByText(/McLaren MP4\/4/i)).toBeInTheDocument();
  });

});

