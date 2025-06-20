import { parse } from "csv-parse";
import fs from "fs";
import { analysisQueue } from "../queues/analysisQueue";
import { query } from "../db";
import dataAnalyzer from "../agents/dataAnalyzer";

analysisQueue.process(async (job) => {
  const { jobId, filePath } = job.data as { jobId: number; filePath: string };
  try {
    const records: any[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath, { encoding: "utf8" })
        .pipe(
          parse({
            bom: true,               // ← strip UTF-8 BOM if present
            columns: true,
            skip_empty_lines: true,
          })
        )
        .on("data", (row) => records.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    for (const raw of records) {
      const m = dataAnalyzer(raw);
      await query(
        `INSERT INTO metrics
          (job_id, roas, acos, ctr, top_keywords, bottom_keywords)
         VALUES($1,$2,$3,$4,$5,$6)`,
        [jobId, m.roas, m.acos, m.ctr, m.top_keywords, m.bottom_keywords]
      );
    }

    await query(
      "UPDATE analysis_jobs SET status=$1, completed_at=NOW() WHERE id=$2",
      ["completed", jobId]
    );
  } catch (err: any) {
    console.error("Worker error:", err);
    await query(
      "UPDATE analysis_jobs SET status=$1, error_msg=$2 WHERE id=$3",
      ["failed", err.message, jobId]
    );
  }
});
