import React, { useState } from "react";
import axios from "axios";

interface Task {
  task: string;
  priority: number;
}

interface Props {
  jobId: number;
}

export default function OptimizationList({ jobId }: Props) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post<{ tasks: Task[] }>(`/api/optimize/${jobId}`);
      setTasks(res.data.tasks);
    } catch (err) {
      setError("Failed to generate optimization tasks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 32, textAlign: "center" }}>
      <button
        onClick={generate}
        disabled={loading}
        style={{
          fontSize: 18,
          padding: "8px 24px",
          borderRadius: 6,
          background: "#388e3c",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating…" : "Generate Optimization"}
      </button>
      {error && <div style={{ color: "#d32f2f", marginTop: 8 }}>{error}</div>}
      {tasks && (
        <ul
          style={{
            marginTop: 24,
            listStyle: "none",
            padding: 0,
          }}
        >
          {tasks.map((t, i) => (
            <li
              key={i}
              style={{
                background: "#f1f8e9",
                margin: "8px 0",
                padding: 12,
                borderRadius: 8,
                color: "#388e3c",
                fontWeight: 500,
              }}
            >
              <span style={{ marginRight: 12 }}>[{t.priority}]</span> {t.task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
