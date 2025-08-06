//TESTS:
// Data is sent correctly to the API
//if the API responds with an error message, the error message is displayed
//if there is a network error, the error message is displayed
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HistoryForm from "../historyForm";

test("sends form data to API and resets on success", async () => {
  const mockOnHistoryAdded = jest.fn();

  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );

  render(<HistoryForm carId="123" onHistoryAdded={mockOnHistoryAdded} />);

  fireEvent.change(screen.getByLabelText(/event title/i), {
    target: { value: "oil-change" },
  });
  fireEvent.change(screen.getByLabelText(/event date/i), {
    target: { value: "2023-10-10" },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: "oil has been changed" },
  });

  fireEvent.click(screen.getByRole("button", { name: /create/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockOnHistoryAdded).toHaveBeenCalled();
    expect(screen.getByLabelText(/event title/i)).toHaveValue("");
  });
});


test("shows alert if API returns error", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
  );

  window.alert = jest.fn();

  render(<HistoryForm carId="123" onHistoryAdded={jest.fn()} />);

  fireEvent.change(screen.getByLabelText(/event title/i), {
    target: { value: "Error Test" },
  });
  fireEvent.change(screen.getByLabelText(/event date/i), {
    target: { value: "2023-11-11" },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: "failed intent" },
  });

  fireEvent.click(screen.getByRole("button", { name: /create/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Error adding history event");
  });
});


test("shows alert on network error", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

  window.alert = jest.fn();

  render(<HistoryForm carId="123" onHistoryAdded={jest.fn()} />);

  fireEvent.change(screen.getByLabelText(/event title/i), {
    target: { value: "Error" },
  });
  fireEvent.change(screen.getByLabelText(/event date/i), {
    target: { value: "2023-12-12" },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: "Network Error" },
  });

  fireEvent.click(screen.getByRole("button", { name: /create/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Network error");
  });
});
