Great, Madhan 👍
Here is a **professional GitHub-style README.md with badges**. This looks much stronger for **resume / recruiters / DevOps portfolio**.

You can **copy-paste directly into `README.md`**.

---

# 🚀 DevFlow – CI/CD Pipeline Dashboard

![GitHub repo size](https://img.shields.io/github/repo-size/madhan-231105/DevFlow_CI-CD_Pipeline)
![GitHub stars](https://img.shields.io/github/stars/madhan-231105/DevFlow_CI-CD_Pipeline?style=social)
![GitHub forks](https://img.shields.io/github/forks/madhan-231105/DevFlow_CI-CD_Pipeline?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/madhan-231105/DevFlow_CI-CD_Pipeline)
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/madhan-231105/DevFlow_CI-CD_Pipeline/main.yml?label=CI%2FCD)

DevFlow is a **real-time CI/CD pipeline monitoring dashboard** that visualizes **GitHub Actions workflows**.

It allows users to:

* Trigger CI/CD pipelines
* Monitor build stages
* View GitHub Actions history
* Track pipeline status in real time

This project demonstrates **CI/CD concepts, GitHub Actions integration, and DevOps monitoring dashboards**.

---

# 🔗 Live Demo

### 🌐 Frontend (Dashboard)

[https://devflow-ci-cd.vercel.app/](https://devflow-ci-cd.vercel.app/)

### ⚙ Backend API

[https://devflow-ci-cd-pipeline.onrender.com](https://devflow-ci-cd-pipeline.onrender.com)

### 📦 GitHub Repository

[https://github.com/madhan-231105/DevFlow_CI-CD_Pipeline](https://github.com/madhan-231105/DevFlow_CI-CD_Pipeline)

### 🔄 GitHub Actions

[https://github.com/madhan-231105/DevFlow_CI-CD_Pipeline/actions](https://github.com/madhan-231105/DevFlow_CI-CD_Pipeline/actions)

---

# 📸 Preview

DevFlow Dashboard includes:

* Pipeline Visualizer
* GitHub Actions History
* Real-time Pipeline Status
* Trigger CI/CD Button
* GitHub Workflow Integration

---

# ⚙ Tech Stack

### Frontend

* React
* Vite
* Custom CSS DevOps Dashboard UI

### Backend

* Node.js
* Express.js
* GitHub REST API

### DevOps

* GitHub Actions
* Vercel (Frontend Hosting)
* Render (Backend Hosting)

---

# ✨ Features

## 📊 CI/CD Pipeline Visualization

Displays pipeline stages visually:

```
Code Push → Build → Test → Deploy
```

---

## ⚡ Trigger Pipeline

Users can trigger CI/CD from the dashboard.

---

## 📈 Pipeline Status Monitoring

Shows real-time pipeline status:

* queued
* running
* success
* failure

---

## 📜 Pipeline History

Displays recent GitHub workflow runs including:

* Run number
* Status
* Commit SHA
* Execution time

---

## 🔗 GitHub Actions Integration

Uses GitHub REST API:

```
GET /repos/{owner}/{repo}/actions/runs
```

to retrieve workflow runs.

---

# 🏗 Project Architecture

```
DevFlow
│
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │
│   └── vite.config.js
│
├── backend
│   ├── server.js
│   ├── names.json
│
├── .github
│   └── workflows
│       └── main.yml
│
└── README.md
```

---

# 🔄 CI/CD Pipeline

The GitHub Actions workflow runs automatically on:

* push to `main`
* manual workflow dispatch

---

# 📄 GitHub Actions Workflow

```yaml
name: DevFlow CI/CD Pipeline

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Backend Dependencies
        working-directory: backend
        run: npm install

      - name: Install Frontend Dependencies
        working-directory: frontend
        run: npm install

      - name: Build Frontend
        working-directory: frontend
        run: npm run build

      - name: Deploy
        run: echo "Deployment Successful 🚀"
```

---

# 🚀 Running Locally

## Clone the Repository

```
git clone https://github.com/madhan-231105/DevFlow_CI-CD_Pipeline.git
cd DevFlow_CI-CD_Pipeline
```

---

## Backend

```
cd backend
npm install
node server.js
```

Backend runs at:

```
http://localhost:5000
```

---

## Frontend

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 📊 DevFlow Dashboard Features

| Feature             | Description                |
| ------------------- | -------------------------- |
| Pipeline Visualizer | Displays CI/CD stages      |
| GitHub Integration  | Fetch workflow runs        |
| Real-Time Updates   | Polls GitHub API           |
| Pipeline History    | Shows workflow runs        |
| Trigger Pipeline    | Start CI/CD from dashboard |

---

# 🎯 Purpose of the Project

This project demonstrates:

* CI/CD pipeline monitoring
* GitHub Actions integration
* DevOps workflow visualization
* Full stack development
* Real-time dashboard UI

Built as a **DevOps portfolio project**.

---

# 👨‍💻 Author

**Madhan G**

Full Stack Developer | DevOps Enthusiast

GitHub
[https://github.com/madhan-231105](https://github.com/madhan-231105)

---

⭐ If you like this project, please **star the repository**.

---
