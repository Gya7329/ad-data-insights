import React, { useState, FormEvent } from "react";
import axios from "axios";

interface Props {
  onUploaded: (jobId: number) => void;
}

export default function UploadForm({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await axios.post<{ jobId: number }>("/api/upload", data);
      onUploaded(res.data.jobId);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
          width: 240,
        }}
      />
      <button
        type="submit"
        disabled={loading || !file}
        style={{
          fontSize: 18,
          padding: "8px 24px",
          borderRadius: 6,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Uploading…" : "Upload CSV"}
      </button>
      {error && <div style={{ color: "#d32f2f", marginTop: 8 }}>{error}</div>}
    </form>
  );
}
