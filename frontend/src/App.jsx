import { useState, useEffect } from "react";
import "./App.css";

const STAGES = ["Code Push", "Build", "Test", "Deploy"];
const API = "https://devflow-ci-cd-pipeline.onrender.com";
const REPO_OWNER = "madhan-231105";
const REPO_NAME = "DevFlow_CI-CD_Pipeline";

function App() {
  const [names, setNames] = useState([]);
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [pipelineHistory, setPipelineHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch latest pipeline status from your backend
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API}/pipeline-status`);
      const data = await res.json();
      setPipelineStatus(data);
    } catch (error) {
      console.error("Error fetching pipeline status:", error);
    }
  };

  // Fetch workflow history directly from GitHub API
  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=8`
      );
      const data = await res.json();
      setPipelineHistory(data.workflow_runs || []);
    } catch (error) {
      console.error("Failed to fetch pipeline history", error);
    }
  };

  const triggerPipeline = async () => {
    const name = prompt("Enter your name to trigger the pipeline:");
    if (!name) return;
    setLoading(true);
    try {
      await fetch(`${API}/add-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      fetchStatus();
      fetchHistory();
    } catch (error) {
      console.error("Failed to trigger pipeline:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    fetchHistory();
    // Poll every 15 seconds (to avoid GitHub API rate limits)
    const interval = setInterval(() => {
      fetchStatus();
      fetchHistory();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <header>
        <h1>DevFlow 🚀</h1>
        <p className="subtitle">Real-Time CI/CD Pipeline Dashboard</p>
      </header>

      <div className="card">
        {/* Pipeline Visualizer */}
        <div className="pipeline">
          {STAGES.map((stage, index) => {
            let statusClass = "";
            if (pipelineStatus?.status === "in_progress" && index === 1) statusClass = "active";
            if (pipelineStatus?.conclusion === "success") statusClass = "completed";
            return (
              <div key={stage} className={`stage ${statusClass}`}>
                {stage}
              </div>
            );
          })}
        </div>

        <button className="deploy-btn" onClick={triggerPipeline} disabled={loading}>
          {loading ? "Triggering..." : "Trigger CI/CD"}
        </button>

        {/* Pipeline History Table */}
        <div className="history-section">
          <div className="section-header">
            <h3>Pipeline History</h3>
            <a 
              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/actions`} 
              target="_blank" 
              rel="noreferrer"
              className="view-all-link"
            >
              View All on GitHub ↗
            </a>
          </div>

          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Run</th>
                  <th>Status</th>
                  <th>Commit</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {pipelineHistory.map((run) => (
                  <tr key={run.id}>
                    <td>
                      <a href={run.html_url} target="_blank" rel="noreferrer" className="run-number">
                        #{run.run_number}
                      </a>
                    </td>
                    <td>
                      <span className={`badge ${run.conclusion || run.status}`}>
                        {run.conclusion || run.status}
                      </span>
                    </td>
                    <td className="commit-sha">{run.head_sha.slice(0, 7)}</td>
                    <td className="time-cell">{new Date(run.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;