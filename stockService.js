const { PythonShell } = require("python-shell");

function fetchNifty50Data() {
  return new Promise((resolve, reject) => {
    PythonShell.run("fetch_nifty50_data.py", null, (err, results) => {
      if (err) {
        console.error("Error running Python script:", err);
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(results[0]);
          console.log("Parsed JSON data:", jsonData);
          resolve(jsonData);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          reject(parseError);
        }
      }
    });
  });
}

module.exports = { fetchNifty50Data };
