import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("ProtectedRoute", () => {
  it("muestra spinner mientras inicializa", async () => {
    // Re-mock para este caso
    vi.doMock("../../../contexts/AuthContext", () => ({
      useAuth: () => ({ isAuthenticated: false, isInitializing: true }),
    }));
    const { default: PR } = await import("../ProtectedRoute");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PR>
                <div>Contenido Privado</div>
              </PR>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Restaurando sesión/i)).toBeInTheDocument();
  });

  it("redirige a /login si no está autenticado y no inicializa", async () => {
    // Mock explícito: no auth, no initializing
    vi.doMock("../../../contexts/AuthContext", () => ({
      useAuth: () => ({ isAuthenticated: false, isInitializing: false }),
    }));
    const { default: PR } = await import("../ProtectedRoute");

    render(
      <MemoryRouter initialEntries={["/dashboard?x=1"]}>
        <Routes>
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route
            path="/dashboard"
            element={
              <PR>
                <div>Contenido Privado</div>
              </PR>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Página de Login/i)).toBeInTheDocument();
  });

  it("muestra contenido cuando está autenticado", async () => {
    // Re-mock: authenticated
    vi.doMock("../../../contexts/AuthContext", () => ({
      useAuth: () => ({ isAuthenticated: true, isInitializing: false }),
    }));
    const { default: PR } = await import("../ProtectedRoute");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PR>
                <div>Contenido Privado</div>
              </PR>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Contenido Privado/i)).toBeInTheDocument();
  });
});
