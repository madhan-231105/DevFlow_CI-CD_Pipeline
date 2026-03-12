const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const simpleGit = require("simple-git");

const app = express();

// connect git to root project
const git = simpleGit("../");

app.use(cors());
app.use(express.json());

const FILE_PATH = "../names.json";

// Ensure names.json exists
async function initFile() {
  if (!await fs.pathExists(FILE_PATH)) {
    await fs.writeJson(FILE_PATH, []);
  }
}

initFile();

// Add name and trigger git push
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

    // Add new entry
    const newEntry = {
      name,
      time: new Date().toISOString()
    };

    names.push(newEntry);

    // Save updated list
    await fs.writeJson(FILE_PATH, names, { spaces: 2 });

    // --- Git Automation ---
    await git.pull("origin", "main", { "--rebase": "true" });
    await git.add(".");
    await git.commit(`Added name: ${name}`);
    await git.push("origin", "main");

    res.json({
      success: true,
      message: "Name added and pushed to GitHub 🚀",
      data: newEntry
    });

  } catch (error) {
    console.error("Git operation error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to run git automation"
    });
  }
});

// Get list of names
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

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});