import React, { useState } from "react";
import axios from "axios";

interface Task {
  task: string;
  priority: number;
}

interface Props {
  jobId: number;
}

export default function OptimizationList({ jobId }: Props) {
  const [tasks, setTasks] = useState<Task[] | null>(null);

  const generate = async () => {
    const res = await axios.post<{ tasks: Task[] }>(`/api/optimize/${jobId}`);
    setTasks(res.data.tasks);
  };

  return (
    <div>
      <button onClick={generate}>Generate Optimization</button>
      {tasks && (
        <ul>
          {tasks.map((t, i) => (
            <li key={i}>
              [{t.priority}] {t.task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
