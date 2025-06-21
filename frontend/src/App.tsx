import React, { useState } from "react";
import PinLogin from "./components/PinLogin";
import UploadForm from "./components/UploadForm";
import Results from "./components/Results";
import OptimizationList from "./components/OptimizationList";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [jobId, setJobId] = useState<number | null>(null);

  if (!loggedIn) {
    return <PinLogin onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div
      style={{
        padding: 16,
        minHeight: "100vh",
        background: "linear-gradient(135deg,#e3f2fd 0%,#fce4ec 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px #0001",
          padding: 32,
        }}
      >
        <h1 style={{ textAlign: "center", color: "#1976d2", marginBottom: 32 }}>
          Ad Analysis Dashboard
        </h1>
        {!jobId ? (
          <UploadForm onUploaded={setJobId} />
        ) : (
          <>
            <Results jobId={jobId} />
            <OptimizationList jobId={jobId} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
