// src/agents/taskCreator.ts

export interface OptimizationTask {
  task: string;
  priority: number;
  keyword?: string; // Optional keyword for task association
}

export function taskCreator(metrics: Metrics): OptimizationTask[] {
  const tasks: OptimizationTask[] = [];

  if (metrics.acos > 0.3) {
    tasks.push({
      task: "Lower bids on low-performing keywords",
      priority: 1,
    });
  }

  if (metrics.roas < 2) {
    tasks.push({
      task: "Reallocate budget to top-performing ad groups",
      priority: 2,
    });
  }

  return tasks;
}
