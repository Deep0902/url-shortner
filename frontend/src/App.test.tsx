import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// Mock window.scrollTo to avoid errors in jsdom
window.scrollTo = window.scrollTo || jest.fn();

// Mock axios to avoid real network requests
jest.mock("axios");

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic render test
  test("renders URL Shortener title", () => {
    render(<App />);
    expect(screen.getByText(/URL Shortener/i)).toBeInTheDocument();
  });

  // Test input and button
  test("shows error alert for invalid URL", async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Enter your URL/i);
    const button = screen.getByText(/Shorten/i);

    fireEvent.change(input, { target: { value: "invalid-url" } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText(/Invalid URL/i)).toBeInTheDocument()
    );
  });

  // You can add more tests for successful shortening, stats, etc.
});