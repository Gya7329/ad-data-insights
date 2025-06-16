import { Request, Response } from "express";
import Queue from "bull";
import { query } from "../db";

const analysisQueue = new Queue("analysis", process.env.REDIS_URL!);

export async function handleUpload(req: Request, res: Response) {
  const filePath = req.file!.path;
  const result = await query<{ id: number }>(
    "INSERT INTO analysis_jobs(status, submitted_at) VALUES($1, NOW()) RETURNING id",
    ["queued"]
  );
  const jobId = result.rows[0].id;
  await analysisQueue.add({ jobId, filePath });
  res.json({ jobId });
}
