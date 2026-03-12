import { useState, useEffect } from "react";
import "./App.css";

const STAGES = ["Code Push", "Build", "Test", "Deploy"];

function App() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const startSimulation = () => {
    setCurrentStep(-1);
    setIsRunning(true);

    setTimeout(() => {
      setCurrentStep(0);
    }, 200);
  };

  useEffect(() => {
    if (isRunning && currentStep >= 0 && currentStep < STAGES.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1200);

      return () => clearTimeout(timer);
    }

    if (currentStep === STAGES.length) {
      setIsRunning(false);
    }
  }, [isRunning, currentStep]);

  const getStatusText = () => {
    if (!isRunning && currentStep === -1) return "Idle 💤";
    if (isRunning && currentStep < STAGES.length)
      return `Running: ${STAGES[currentStep]} ⏳`;
    if (!isRunning && currentStep === STAGES.length)
      return "All Systems Go! ✅";

    return "Idle 💤";
  };

  return (
    <div className="container">
      <header>
        <h1>DevFlow 🚀</h1>
        <p className="subtitle">Automated CI/CD Pipeline Visualizer</p>
      </header>

      <div className="card">
        <p className="description">
          This project demonstrates a Continuous Integration and Continuous
          Deployment pipeline using GitHub Actions.
        </p>

        <div className="pipeline">
          {STAGES.map((stage, index) => (
            <div key={stage} className="stage-wrapper">
              <div
                className={`stage ${
                  index === currentStep ? "active" : ""
                } ${index < currentStep ? "completed" : ""}`}
              >
                {stage}
              </div>

              {index < STAGES.length - 1 && (
                <div
                  className={`arrow ${
                    index < currentStep ? "completed-arrow" : ""
                  }`}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="status-box">
          <h3>Pipeline Status</h3>
          <p
            className={`status-text ${
              currentStep === STAGES.length ? "success" : ""
            }`}
          >
            {getStatusText()}
          </p>
        </div>

        <button
          className="deploy-btn"
          onClick={startSimulation}
          disabled={isRunning}
        >
          {isRunning
            ? "Deploying..."
            : currentStep === STAGES.length
            ? "Restart Deployment"
            : "Simulate Deployment"}
        </button>
      </div>
    </div>
  );
}

export default App;