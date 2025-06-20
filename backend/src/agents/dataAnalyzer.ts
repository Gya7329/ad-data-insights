import { Metrics } from "../controllers/analysisController";

// dataAnalyzer agent
export default function dataAnalyzer(raw: Record<string, any>): Metrics {
  console.log("dataAnalyzer called with raw data:", raw);

  // 1. Safely parse the real CSV columns
  const impressions = parseFloat(raw.Impressions) || 0;
  const clicks      = parseFloat(raw.Clicks)      || 0;
  const spend       = parseFloat(raw["Spend(USD)"]) || 0;
  const sales       = parseFloat(raw["Sales(USD)"]) || 0;

  // 2. Compute metrics (guard against division by zero)
  const ctr  = impressions > 0 ? clicks / impressions : 0;
  const roas = spend      > 0 ? sales  / spend       : 0;
  const acos = sales      > 0 ? spend  / sales       : 0;

  // 3. Extract a keyword — use "Product targets" or fall back to "Matched product "
  const term =
    (raw["Product targets"] as string)?.trim() ||
    (raw["Matched product "] as string)?.trim() ||
    "";
  const topKeywords    = term ? [term] : [];
  const bottomKeywords = term ? []     : [];

  console.log("Computed metrics:", { roas, acos, ctr, topKeywords, bottomKeywords });

  return {
    roas,
    acos,
    ctr,
    top_keywords:    topKeywords,
    bottom_keywords: bottomKeywords,
  };
}
