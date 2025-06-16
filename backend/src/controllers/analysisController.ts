import { Request, Response } from "express";
import { query } from "../db";

export interface Metrics {
  roas: number;
  acos: number;
  ctr: number;
  top_keywords: string[];
  bottom_keywords: string[];
}

export async function getAnalysisStatus(req: Request, res: Response) {
  const { id } = req.params;
  const jobResult = await query<{ status: string; completed_at: Date | null; error_msg: string | null }>(
    "SELECT status, completed_at, error_msg FROM analysis_jobs WHERE id = $1",
    [id]
  );
  if (!jobResult.rows.length) return res.status(404).send("Not found");
  const job = jobResult.rows[0];

  if (job.status !== "completed") {
    return res.json({ status: job.status, error: job.error_msg });
  }

  const metricsResult = await query<Metrics>(
    "SELECT roas, acos, ctr, top_keywords, bottom_keywords FROM metrics WHERE job_id = $1",
    [id]
  );
  res.json({ status: "completed", metrics: metricsResult.rows[0] });
}
