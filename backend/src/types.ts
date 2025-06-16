interface Metrics {
  roas: number;
  acos: number;
  ctr: number;
  top_keywords: string[];
  bottom_keywords: string[];
}
interface AnalysisJob {
  id: number;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: Date;
    completed_at?: Date | null;
    error_msg?: string | null;
}
interface AnalysisJobWithMetrics extends AnalysisJob {
  metrics?: Metrics;
}       


  