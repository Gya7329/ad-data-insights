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

  if (status !== "completed") return <p>Analysis: {status}</p>;
  if (!metrics) return null;
  return (
    <div>
      <h3>Metrics</h3>
      <p>ROAS: {Number(metrics.roas).toFixed(2)}</p>
      <p>ACOS: {Number(metrics.acos).toFixed(2)}</p>
      <p>CTR: {(Number(metrics.ctr) * 100).toFixed(1)}%</p>
      <p>Top Keywords: {metrics.top_keywords.join(", ")}</p>
      <p>Bottom Keywords: {metrics.bottom_keywords.join(", ")}</p>
    </div>
  );
}
