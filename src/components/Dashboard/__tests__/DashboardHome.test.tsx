import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardHome from "../DashboardHome";

describe("DashboardHome", () => {
  it("muestra saludo y logo principal", () => {
    render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>,
    );

    // Saludo principal
    expect(
      screen.getByRole("heading", { name: /hola.*miia/i }),
    ).toBeInTheDocument();

    // Logo principal de inicio (miia.png)
    const img = screen.getByRole("img", { name: /miia/i });
    expect(img).toBeInTheDocument();
    // No afirmamos tamaño exacto; sí que apunta al recurso esperado
    expect((img as HTMLImageElement).getAttribute("src")).toBe("/miia.png");
  });
});
