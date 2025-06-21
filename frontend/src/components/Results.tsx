import React, { useEffect, useState } from "react";
import axios from "axios";

interface Metrics {
  roas: number;
  acos: number;
  ctr: number;
  top_keywords: string[];
  bottom_keywords: string[];
}

interface Props {
  jobId: number;
}

export default function Results({ jobId }: Props) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  console.log("Results component mounted with jobId:", metrics);
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    let interval = setInterval(async () => {
      const res = await axios.get<{ status: string; metrics?: Metrics }>(
        `/api/analysis/${jobId}`
      );
      setStatus(res.data.status);
      if (res.data.status === "completed" && res.data.metrics) {
        setMetrics(res.data.metrics);
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId]);

  if (status !== "completed")
    return (
      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <span style={{ fontSize: 20, color: "#1976d2" }}>
          Analysis: {status}…
        </span>
      </div>
    );
  if (!metrics) return null;
  return (
    <div style={{ margin: "32px 0" }}>
      <h3 style={{ color: "#1976d2", marginBottom: 16 }}>Metrics</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}
      >
        <MetricCard
          label="ROAS"
          value={Number(metrics.roas)?.toFixed(2)}
          color="#43a047"
        />
        <MetricCard
          label="ACOS"
          value={Number(metrics.acos)?.toFixed(2)}
          color="#e65100"
        />
        <MetricCard
          label="CTR"
          value={
            metrics.ctr !== undefined
              ? (Number(metrics.ctr) * 100).toFixed(1) + "%"
              : "N/A"
          }
          color="#1976d2"
        />
      </div>
      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 32,
          justifyContent: "center",
        }}
      >
        <KeywordList
          title="Top Keywords"
          keywords={metrics.top_keywords}
          color="#43a047"
        />
        <KeywordList
          title="Bottom Keywords"
          keywords={metrics.bottom_keywords}
          color="#e65100"
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div
      style={{
        background: color + "11",
        borderRadius: 12,
        padding: 20,
        minWidth: 120,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 18, color }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function KeywordList({
  title,
  keywords,
  color,
}: {
  title: string;
  keywords: string[];
  color: string;
}) {
  return (
    <div>
      <div style={{ fontWeight: 600, color, marginBottom: 8 }}>{title}</div>
      <ul style={{ paddingLeft: 20, color }}>
        {keywords.length ? (
          keywords.map((k, i) => <li key={i}>{k}</li>)
        ) : (
          <li>None</li>
        )}
      </ul>
    </div>
  );
}
