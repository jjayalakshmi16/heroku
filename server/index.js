const express = require("express");
const path = require("path");
const generatePassword = require("password-generator");

const app = express();

const { Pool } = require("pg");
const pool = new Pool({
  user: "lpxotafiwicylh",
  host: "ec2-52-204-232-46.compute-1.amazonaws.com",
  database: "d14qhcrq07gtub",
  password: "cef7f1533511e57830bc7888ce400fd57de374904208fafdf6b1e98c3e85d776",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Put all API endpoints under '/api'
app.get("/api/passwords", (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map((i) =>
    generatePassword(12, false)
  );

  app.get("/db", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM sample");
      const results = { results: result ? result.rows : null };
      res.render("pages/db", results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

  // Return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
