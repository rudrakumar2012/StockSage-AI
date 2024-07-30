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
    const python = spawn("python3", [
      path.join(__dirname, "nifty_stocks_fetcher.py"), // Updated Python script name
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
        // Symbol exists, update price, change percentage, and index
        await client.query(
          `UPDATE stocks 
           SET price = $1, change_percentage = $2, index = $3
           WHERE symbol = $4`,
          [stock.price, stock.changePercentage, stock.index, stock.symbol]
        );
      } else {
        // Symbol does not exist, insert new record
        await client.query(
          `INSERT INTO stocks (symbol, sector, price, change_percentage, index)
           VALUES ($1, $2, $3, $4, $5)`,
          [stock.symbol, stock.sector, stock.price, stock.changePercentage, stock.index]
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

// Fetch stock data from database route with optional index filter
app.get("/api/stocks", async (req, res) => {
  try {
    const { index } = req.query;
    let query = "SELECT * FROM stocks";
    const queryParams = [];

    if (index) {
      query += " WHERE index = $1";
      queryParams.push(index);
    }

    const { rows } = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching stock data from database:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch stock data from database" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});