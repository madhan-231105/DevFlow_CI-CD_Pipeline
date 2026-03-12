import { useState, useEffect } from "react";
import "./App.css";

const STAGES = ["Code Push", "Build", "Test", "Deploy"];

const API = "https://devflow-ci-cd-pipeline.onrender.com";

function App() {
  const [names, setNames] = useState([]);
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------------------
     Trigger CI/CD
  ----------------------------*/
  const triggerPipeline = async () => {
    const name = prompt("Enter your name");

    if (!name) return;

    setLoading(true);

    try {
      await fetch(`${API}/add-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });

      setNames((prev) => [...prev, name]);
    } catch (error) {
      console.error("Failed to trigger pipeline:", error);
    }

    setLoading(false);
  };

  /* ---------------------------
     Fetch names list
  ----------------------------*/
  const fetchNames = async () => {
    try {
      const res = await fetch(`${API}/names`);
      const data = await res.json();

      setNames(data.map((n) => n.name));
    } catch (err) {
      console.error("Failed to fetch names", err);
    }
  };

  /* ---------------------------
     Fetch pipeline status
  ----------------------------*/
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API}/pipeline-status`);
      const data = await res.json();
      setPipelineStatus(data);
    } catch (error) {
      console.error("Error fetching pipeline status:", error);
    }
  };

  useEffect(() => {
    fetchNames();
    fetchStatus();

    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------------------
     Pipeline stage logic
  ----------------------------*/
  const getStageStatus = (index) => {
    if (!pipelineStatus) return "";

    if (pipelineStatus.status === "in_progress") {
      if (index === 1) return "active";
      if (index < 1) return "completed";
    }

    if (pipelineStatus.conclusion === "success") {
      return "completed";
    }

    return "";
  };

  const getStatusText = () => {
    if (!pipelineStatus) return "Idle 💤";

    if (pipelineStatus.status === "in_progress")
      return "Pipeline Running ⏳";

    if (pipelineStatus.conclusion === "success")
      return "Deployment Successful ✅";

    if (pipelineStatus.conclusion === "failure")
      return "Pipeline Failed ❌";

    return "Waiting...";
  };

  return (
    <div className="container">
      <header>
        <h1>DevFlow 🚀</h1>
        <p className="subtitle">
          Real-Time CI/CD Pipeline Dashboard
        </p>
      </header>

      <div className="card">
        <p className="description">
          This dashboard monitors GitHub Actions and
          automatically updates pipeline status.
        </p>

        {/* Pipeline stages */}
        <div className="pipeline">
          {STAGES.map((stage, index) => (
            <div
              key={stage}
              className={`stage ${getStageStatus(index)}`}
            >
              {stage}
            </div>
          ))}
        </div>

        {/* Status box */}
        <div className="status-box">
          <h3>Pipeline Status</h3>
          <p className="status-text">{getStatusText()}</p>

          {pipelineStatus && (
            <a
              href={pipelineStatus.url}
              target="_blank"
              rel="noreferrer"
            >
              View GitHub Workflow
            </a>
          )}
        </div>

        {/* Trigger button */}
        <button
          className="deploy-btn"
          onClick={triggerPipeline}
          disabled={loading}
        >
          {loading ? "Triggering..." : "Trigger CI/CD"}
        </button>

        {/* Names list */}
        <div className="names-section">
          <h3>Triggered By</h3>
          <ul>
            {names.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;