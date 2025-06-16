import { Metrics } from "../controllers/analysisController";

// insightGenerator agent
export default async function insightGenerator(metrics: Metrics): Promise<string> {
  // call LLM via langchain with a prompt
  return `Your ROAS is ${metrics.roas.toFixed(2)}, CTR at ${(
    metrics.ctr * 100
  ).toFixed(1)}%.`;
}
