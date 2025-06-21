import React, { useState } from "react";

interface PinLoginProps {
  onSuccess: () => void;
}

export default function PinLogin({ onSuccess }: PinLoginProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo PIN: 1234
    if (pin === "1234") {
      setError("");
      onSuccess();
    } else {
      setError("Invalid PIN. Try 1234.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        background: "#fff",
        padding: 32,
        borderRadius: 12,
        boxShadow: "0 2px 16px #0001",
        maxWidth: 320,
        margin: "64px auto",
      }}
    >
      <h2>Enter PIN</h2>
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter 4-digit PIN"
        maxLength={4}
        style={{
          fontSize: 24,
          letterSpacing: 8,
          textAlign: "center",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
          width: 160,
        }}
      />
      <button
        type="submit"
        style={{
          fontSize: 18,
          padding: "8px 24px",
          borderRadius: 6,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Login
      </button>
      {error && <div style={{ color: "#d32f2f", marginTop: 8 }}>{error}</div>}
    </form>
  );
}
