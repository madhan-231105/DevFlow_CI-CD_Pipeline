const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const simpleGit = require("simple-git");

const app = express();
const git = simpleGit("../"); // root project repo

app.use(cors());
app.use(express.json());

const FILE_PATH = "../names.json";

// ensure file exists
if (!fs.existsSync(FILE_PATH)) {
  fs.writeJsonSync(FILE_PATH, []);
}

app.post("/add-name", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    // read existing names
    const names = await fs.readJson(FILE_PATH);

    // add new name
    names.push({
      name,
      time: new Date().toISOString(),
    });

    await fs.writeJson(FILE_PATH, names, { spaces: 2 });

    // Git automation
    await git.add(".");
    await git.commit(`Added name: ${name}`);
    await git.push("origin", "main");

    res.json({
      message: "Name added and pushed to GitHub 🚀",
      data: names,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to push changes",
    });
  }
});

app.get("/names", async (req, res) => {
  const names = await fs.readJson(FILE_PATH);
  res.json(names);
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
