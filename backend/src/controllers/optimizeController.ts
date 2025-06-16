import { Request, Response } from "express";
import { taskCreator } from "../agents";
import { query } from "../db";
import type { Metrics } from "./analysisController";// Adjust the path if Metrics is defined elsewhere

export async function optimizeJob(req: Request, res: Response) {
  const { id } = req.params;
  const metricsResult = await query("SELECT * FROM metrics WHERE job_id = $1", [id]);
  if (!metricsResult.rows.length) return res.status(404).send("Metrics not found");

  const raw = metricsResult.rows[0];
  const tasks = await taskCreator(raw as Metrics);
  for (const t of tasks) {
    await query("INSERT INTO optimize_tasks(job_id, task, priority, created_at) VALUES($1,$2,$3,NOW())", [
      id,
      t.task,
      t.priority,
    ]);
  }

  res.json({ tasks });
}
