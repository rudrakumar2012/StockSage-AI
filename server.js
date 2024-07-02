const express = require("express");
const cors = require("cors");
const { fetchNifty50Data } = require('./stockService'); // Adjust the path as per your file structure (stockService');
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

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

app.get('/test/nifty50', async (req, res) => {
  try {
    const nifty50Data = await fetchNifty50Data();
    console.log('Nifty 50 Data:', nifty50Data); // Log fetched data
    res.json({ message: 'Nifty 50 data fetched and logged' });
  } catch (error) {
    console.error('Error fetching Nifty 50 data:', error);
    res.status(500).json({ error: 'Failed to fetch Nifty 50 data' });
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
