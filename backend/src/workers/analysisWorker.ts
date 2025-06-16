import Queue from "bull";
import fs from "fs";
import { parse } from "csv-parse";
import { query } from "../db";
import dataAnalyzer from "../agents/dataAnalyzer";

const analysisQueue = new Queue("analysis", process.env.REDIS_URL!);

analysisQueue.process(async (job) => {
  const { jobId, filePath } = job.data as { jobId: number; filePath: string };
  try {
    const records: any[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on("data", (row) => records.push(row))
        .on("end", resolve)
        .on("error", reject);
    });
    for (const raw of records) {
      const m = dataAnalyzer(raw);
      await query(
        `INSERT INTO metrics(job_id, roas, acos, ctr, top_keywords, bottom_keywords)
         VALUES($1,$2,$3,$4,$5,$6)`,
        [jobId, m.roas, m.acos, m.ctr, m.top_keywords, m.bottom_keywords]
      );
    }
    await query("UPDATE analysis_jobs SET status=$1, completed_at=NOW() WHERE id=$2", ["completed", jobId]);
  } catch (err: any) {
    await query("UPDATE analysis_jobs SET status=$1, error_msg=$2 WHERE id=$3", [
      "failed",
      err.message,
      jobId,
    ]);
  }
});
