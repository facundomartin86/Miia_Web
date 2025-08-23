import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

// Componente de prueba que consume el contexto
function Consumer() {
  const { isAuthenticated, user, login, logout, isInitializing } = useAuth();
  return (
    <div>
      <div>init:{String(isInitializing)}</div>
      <div>auth:{String(isAuthenticated)}</div>
      <div>user:{user ? user.username : "null"}</div>
      <button onClick={() => login("admin", "miia2025")}>login-ok</button>
      <button onClick={() => login("x", "y")}>login-fail</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("AuthProvider (mock)", () => {
  it("login feliz persiste miia_auth y cambia estado", async () => {
    const { getByText } = renderWithProvider();

    // estado inicial
    expect(screen.getByText(/init:false/i)).toBeInTheDocument();
    expect(screen.getByText(/auth:false/i)).toBeInTheDocument();
    expect(screen.getByText(/user:null/i)).toBeInTheDocument();

    fireEvent.click(getByText("login-ok"));

    await waitFor(() => {
      expect(screen.getByText(/auth:true/i)).toBeInTheDocument();
      expect(screen.getByText(/user:admin/i)).toBeInTheDocument();
    });

    // persistencia
    const stored = localStorage.getItem("miia_auth");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored || "{}");
    expect(parsed.user.username).toBe("admin");
  });

  it("login fallido no autentica ni persiste", async () => {
    const { getByText } = renderWithProvider();

    fireEvent.click(getByText("login-fail"));

    await waitFor(() => {
      expect(screen.getByText(/auth:false/i)).toBeInTheDocument();
      expect(screen.getByText(/user:null/i)).toBeInTheDocument();
    });

    expect(localStorage.getItem("miia_auth")).toBeNull();
  });

  it("logout limpia estado y storage", async () => {
    const { getByText } = renderWithProvider();

    // login
    fireEvent.click(getByText("login-ok"));

    await waitFor(() => {
      expect(screen.getByText(/auth:true/i)).toBeInTheDocument();
    });

    // logout
    fireEvent.click(getByText("logout"));

    await waitFor(() => {
      expect(screen.getByText(/auth:false/i)).toBeInTheDocument();
      expect(screen.getByText(/user:null/i)).toBeInTheDocument();
    });

    expect(localStorage.getItem("miia_auth")).toBeNull();
  });

  it("restaura sesión desde localStorage al iniciar (mock)", async () => {
    localStorage.setItem(
      "miia_auth",
      JSON.stringify({
        user: { id: "1", username: "admin", name: "Usuario Principal" },
      }),
    );

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByText(/init:false/i)).toBeInTheDocument();
      expect(screen.getByText(/auth:true/i)).toBeInTheDocument();
      expect(screen.getByText(/user:admin/i)).toBeInTheDocument();
    });
  });
});
