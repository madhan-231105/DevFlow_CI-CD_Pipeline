require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const simpleGit = require("simple-git");
const axios = require("axios");

const app = express();
const git = simpleGit("../");

app.use(cors());
app.use(express.json());

const FILE_PATH = "../names.json";

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
    return res.status(400).json({ error: "Name is required" });
  }

  try {

    /* 1️⃣ Stash any local changes */
    await git.stash();

    /* 2️⃣ Pull latest changes from GitHub */
    await git.pull("origin", "main");

    /* 3️⃣ Restore stashed changes if any */
    try {
      await git.stash(["pop"]);
    } catch (e) {
      // no stash present
    }

    /* 4️⃣ Read names.json */
    const names = await fs.readJson(FILE_PATH);

    const newEntry = {
      name,
      time: new Date().toISOString(),
    };

    names.push(newEntry);

    /* 5️⃣ Write updated names.json */
    await fs.writeJson(FILE_PATH, names, { spaces: 2 });

    /* 6️⃣ Commit change */
    await git.add("names.json");
    await git.commit(`Added name: ${name}`);

    /* 7️⃣ Push commit */
    await git.push("origin", "main");

    res.json({
      success: true,
      message: "Name added and pushed 🚀",
      data: newEntry,
    });

  } catch (error) {
    console.error("Git operation error:", error);

    res.status(500).json({
      error: "Git operation failed",
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
    res.status(500).json({ error: "Failed to read names" });
  }
});

/* -----------------------------
   Get GitHub pipeline status
--------------------------------*/
app.get("/pipeline-status", async (req, res) => {
  try {

    const response = await axios.get(
      `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/actions/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const latestRun = response.data.workflow_runs[0];

    res.json({
      status: latestRun.status,
      conclusion: latestRun.conclusion,
      url: latestRun.html_url,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pipeline status" });
  }
});

/* -----------------------------
   Start Server
--------------------------------*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});