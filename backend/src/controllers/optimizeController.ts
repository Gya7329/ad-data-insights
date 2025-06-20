// src/controllers/optimizeController.ts
import { Request, Response } from "express";
import { query } from "../db";
import { taskCreator, OptimizationTask } from "../agents/taskCreator";

export async function optimizeJob(req: Request, res: Response) {
  const { id } = req.params;

  // 1) Pull *all* metric rows
  const result = await query<Metrics>(
    `SELECT roas, acos, ctr, top_keywords, bottom_keywords
       FROM metrics
      WHERE job_id = $1`,
    [id]
  );
  if (!result.rows.length) {
    return res.status(404).json({ error: "Metrics not found" });
  }

  const allTasks: OptimizationTask[] = [];

  // 2) For each row, parse & feed into the agent
  for (const raw of result.rows) {
    const metrics: Metrics = {
      roas:         parseFloat(String(raw.roas))  || 0,
      acos:         parseFloat(String(raw.acos))  || 0,
      ctr:          parseFloat(String(raw.ctr))   || 0,
      top_keywords:    raw.top_keywords,
      bottom_keywords: raw.bottom_keywords,
    };

    const tasks = await taskCreator(metrics);
    // Optionally tag tasks with which keyword they came from
    for (const t of tasks) {
      allTasks.push({ ...t, keyword: metrics.top_keywords[0] });
    }
  }

  // 3) Persist every generated task
  for (const task of allTasks) {
    await query(
      `INSERT INTO optimize_tasks
         (job_id, task, priority, created_at)
       VALUES($1,$2,$3,NOW())`,
      [id, task.task, task.priority]
    );
  }

  return res.json({ tasks: allTasks });
}

