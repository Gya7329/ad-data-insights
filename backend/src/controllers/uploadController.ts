import { Request, Response } from "express";
import Queue from "bull";
import { query } from "../db";

import { analysisQueue } from "../queues/analysisQueue";

export async function handleUpload(req: Request, res: Response) {
  const filePath = req.file!.path;
  const result = await query<{ id: number }>(
    "INSERT INTO analysis_jobs(status, submitted_at) VALUES($1, NOW()) RETURNING id",
    ["queued"]
  );
  const jobId = result.rows[0].id;
  analysisQueue.on("ready", () => {
    console.log("✅ Analysis queue connected to Redis");
  });
  analysisQueue.add({ jobId, filePath });
  return res.status(202).json({ jobId, status: "queued" });
}
