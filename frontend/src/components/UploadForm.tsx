import React, { useState, FormEvent } from "react";
import axios from "axios";

interface Props {
  onUploaded: (jobId: number) => void;
}

export default function UploadForm({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    const res = await axios.post<{ jobId: number }>("/api/upload", data);
    onUploaded(res.data.jobId);
  };

  return (
    <form onSubmit={submit}>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button type="submit" disabled={loading || !file}>
        {loading ? "Uploading…" : "Upload CSV"}
      </button>
    </form>
  );
}
