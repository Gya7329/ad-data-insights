import { Metrics } from "../controllers/analysisController";

// dataAnalyzer agent
export default function dataAnalyzer(raw: any): Metrics {
  const roas = raw.sales / raw.spend;
  const acos = raw.spend / raw.sales;
  const ctr = raw.clicks / raw.impressions;
  const keywords = raw.search_term; // assume array or single
  // placeholder top/bottom logic
  return { roas, acos, ctr, top_keywords: [keywords], bottom_keywords: [] };
}
