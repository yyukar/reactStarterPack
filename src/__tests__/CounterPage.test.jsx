import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CounterPage from "../pages/CounterPage";

test("Artır butonuna basınca sayaç artar", async () => {
  const user = userEvent.setup();
  render(<CounterPage />);

  expect(screen.getByText(/Sayaç:/)).toHaveTextContent("Sayaç: 0");

  await user.click(screen.getByRole("button", { name: "Artır" }));
  expect(screen.getByText(/Sayaç:/)).toHaveTextContent("Sayaç: 1");
});

