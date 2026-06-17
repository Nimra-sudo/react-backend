const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(bodyParser.json());


const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_W2Yr7cONZEew@ep-curly-sound-asf3e328-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Username:", username);
  console.log("Password:", password);

  try {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE username = $1 
       AND password = $2`,
      [username, password]
    );

    console.log("Records Found:", result.rows.length);

    if (result.rows.length > 0) {
      res.json({
        success: true,
        message: "Login Successful",
      });
    } else {
      res.json({
        success: false,
        message: "Invalid login",
      });
    }
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});