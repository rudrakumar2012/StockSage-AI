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
  connectionString: process.env.POSTGRES_URL,
})

// Function to run Python script and retrieve data
function runPythonScript() {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [
      path.join(__dirname, "fetch_nifty50_data.py"),
    ]);

    let data = "";

    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(`Python script failed with code ${code}`);
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject("Error parsing JSON data from Python script:", error);
        }
      }
    });

    python.stderr.on("data", (err) => {
      reject(`Error occurred in Python script: ${err}`);
    });
  });
}

// Function to save stock data into PostgreSQL database
async function saveStockData(stocks) {
  const client = await pool.connect();
  try {
    for (const stock of stocks) {
      // Check if the symbol already exists in the database
      const existingStock = await client.query(
        "SELECT * FROM stocks WHERE symbol = $1",
        [stock.symbol]
      );

      if (existingStock.rows.length > 0) {
        // Symbol exists, update price and change percentage
        await client.query(
          `UPDATE stocks 
           SET price = $1, change_percentage = $2
           WHERE symbol = $3`,
          [stock.price, stock.changePercentage, stock.symbol]
        );
      } else {
        // Symbol does not exist, insert new record
        await client.query(
          `INSERT INTO stocks (symbol, sector, price, change_percentage)
           VALUES ($1, $2, $3, $4)`,
          [stock.symbol, stock.sector, stock.price, stock.changePercentage]
        );
      }
    }
  } catch (error) {
    console.error("Error saving stock data:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to run Python script and save data to database periodically
async function runPythonScriptAndSaveToDatabase() {
  try {
    console.log("Running Python script and saving data to database...");
    const data = await runPythonScript();
    await saveStockData(data); // Save data to database
    console.log("Stock data saved to database successfully.");
  } catch (error) {
    console.error("Error running Python script and saving to database:", error);
  }
}

// Run Python script and save data to database initially and then every 5 minutes
runPythonScriptAndSaveToDatabase();
setInterval(runPythonScriptAndSaveToDatabase, 300000); // Every 5 minutes

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
})

// Fetch Nifty 50 data from database route
app.get("/api/nifty50", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM stocks");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching Nifty 50 data from database:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch Nifty 50 data from database" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
