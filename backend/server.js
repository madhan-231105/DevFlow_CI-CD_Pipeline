require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const simpleGit = require("simple-git");
const axios = require("axios");
const path = require("path");

const app = express();

// Git setup
const git = simpleGit({
  baseDir: "./",
  binary: "git"
});

app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "names.json");

/* -----------------------------
   Root route
--------------------------------*/
app.get("/", (req, res) => {
  res.json({
    message: "DevFlow Backend Running 🚀",
    endpoints: ["/add-name", "/names", "/pipeline-status"]
  });
});

/* -----------------------------
   Ensure names.json exists
--------------------------------*/
async function initFile() {
  if (!(await fs.pathExists(FILE_PATH))) {
    await fs.writeJson(FILE_PATH, []);
  }
}

initFile();

/* -----------------------------
   Add name + trigger git push
--------------------------------*/
app.post("/add-name", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  try {

    // Read existing names
    const names = await fs.readJson(FILE_PATH);

    const newEntry = {
      name,
      time: new Date().toISOString()
    };

    names.push(newEntry);

    // Save file
    await fs.writeJson(FILE_PATH, names, { spaces: 2 });

    // Git add
    await git.add("names.json");

    // Git commit
    await git.commit(`Added name: ${name}`);

    // Push using GitHub token
    await git.push(
      `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.REPO_OWNER}/${process.env.REPO_NAME}.git`,
      "main"
    );

    res.json({
      success: true,
      message: "Name added and pushed 🚀",
      data: newEntry
    });

  } catch (error) {
    console.error("Git operation error:", error);

    res.status(500).json({
      error: "Git operation failed"
    });
  }
});

/* -----------------------------
   Get names list
--------------------------------*/
app.get("/names", async (req, res) => {
  try {
    const names = await fs.readJson(FILE_PATH);
    res.json(names);
  } catch (error) {
    res.status(500).json({
      error: "Failed to read names"
    });
  }
});

/* -----------------------------
   Get GitHub pipeline status
--------------------------------*/
app.get("/pipeline-status", async (req, res) => {
  try {

    const response = await axios.get(
      `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/actions/runs?per_page=5`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    const runs = response.data.workflow_runs;

    const latestRun =
      runs.find(run => run.status === "in_progress") ||
      runs.find(run => run.status === "queued") ||
      runs[0];

    res.json({
      status: latestRun.status,
      conclusion: latestRun.conclusion,
      url: latestRun.html_url
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch pipeline status"
    });
  }
});

/* -----------------------------
   Start server
--------------------------------*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});