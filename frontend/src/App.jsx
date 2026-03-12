import { useState, useEffect } from "react";
import "./App.css";

const STAGES = ["Code Push", "Build", "Test", "Deploy"];

const API = "https://devflow-ci-cd-pipeline.onrender.com";

function App() {
  const [names, setNames] = useState([]);
  const [pipelineStatus, setPipelineStatus] = useState(null);

  /* ---------------------------
     Trigger CI/CD
  ----------------------------*/
  const triggerPipeline = async () => {
    const name = prompt("Enter your name");

    if (!name) return;

    try {
      await fetch(`${API}/add-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      setNames((prev) => [...prev, name]);
    } catch (error) {
      console.error("Failed to trigger pipeline:", error);
    }
  };

  /* ---------------------------
     Fetch pipeline status
  ----------------------------*/
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API}/pipeline-status`);
        const data = await res.json();
        setPipelineStatus(data);
      } catch (error) {
        console.error("Error fetching pipeline status:", error);
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

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

        <div className="pipeline">
          {STAGES.map((stage) => (
            <div key={stage} className="stage">
              {stage}
            </div>
          ))}
        </div>

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

        <button className="deploy-btn" onClick={triggerPipeline}>
          Trigger CI/CD
        </button>

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