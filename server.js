const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Database connection test
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to Database");
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to NSE Tracker API" });
});

// New function to run Python script
function runPythonScript() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["fetch_nifty50_data.py"]);
    let data = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      errorData += chunk.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python script error:", errorData);
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.length === 0 && errorData) {
            console.error("Python script warnings:", errorData);
          }
          resolve(jsonData);
        } catch (error) {
          console.error("Failed to parse Python script output:", error);
          console.error("Raw output:", data);
          reject(new Error("Failed to parse Python script output"));
        }
      }
    });
  });
}

app.get("/api/nifty50", async (req, res) => {
  try {
    const nifty50Data = await runPythonScript();
    res.json(nifty50Data);
  } catch (error) {
    console.error("Error fetching Nifty 50 data:", error);
    res.status(500).json({ error: "Failed to fetch Nifty 50 data" });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/dist")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
