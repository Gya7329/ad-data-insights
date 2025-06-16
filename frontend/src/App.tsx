import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import Results from "./components/Results";
import OptimizationList from "./components/OptimizationList";

function App() {
  const [jobId, setJobId] = useState<number | null>(null);
  return (
    <div style={{ padding: 16 }}>
      {!jobId ? (
        <UploadForm onUploaded={setJobId} />
      ) : (
        <>
          <Results jobId={jobId} />
          <OptimizationList jobId={jobId} />
        </>
      )}
    </div>
  );
}

export default App;
