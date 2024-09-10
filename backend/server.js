const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const { Pool } = require("pg");
const path = require("path");
const json5 = require('json5');
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
      path.join(__dirname, "nifty_stocks_fetcher.py"),
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
          const jsonData = json5.parse(data); // Parse the entire JSON data
          resolve([jsonData.stocks, jsonData.indexes]); // Extract the stocks and indexes arrays
        } catch (error) {
          reject(`Error parsing JSON: ${error.message}`);
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
        // Symbol exists, update price, change percentage, and index_name
        await client.query(
          `UPDATE stocks 
           SET price = $1, change_percentage = $2, index_name = $3
           WHERE symbol = $4`,
          [stock.price, stock.changePercentage, stock.index, stock.symbol]
        );
      } else {
        // Symbol does not exist, insert new record
        await client.query(
          `INSERT INTO stocks (symbol, sector, price, change_percentage, index_name)
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
// Function to save index data into PostgreSQL database
async function saveIndexData(indexes) {
  const client = await pool.connect();
  try {
    for (const index of indexes) {
      // Check if the index_name already exists in the database
      const existingIndex = await client.query(
        "SELECT * FROM indexes WHERE index_name = $1",
        [index.index_name]
      );

      if (existingIndex.rows.length > 0) {
        // Index_name exists, update price and change percentage
        await client.query(
          `UPDATE indexes 
           SET price = $1, change_percentage = $2
           WHERE index_name = $3`,
          [index.price, index.change_percentage, index.index_name]
        );
      } else {
        // Index_name does not exist, insert new record
        await client.query(
          `INSERT INTO indexes (index_name, price, change_percentage)
           VALUES ($1, $2, $3)`,
          [index.index_name, index.price, index.change_percentage]
        );
      }
    }
  } catch (error) {
    console.error("Error saving index data:", error);
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
    await saveStockData(data[0]); // Save stock data to database
    await saveIndexData(data[1]); // Save index data to database
    console.log("Stock and index data saved to database successfully.");
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

app.get("/api/indexes", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM indexes");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching index data from database:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch index data from database" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
