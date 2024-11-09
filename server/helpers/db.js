import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database:
    process.env.NODE_ENV === "development"
      ? process.env.DB_NAME
      : process.env.TEST_DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Log message when database connects
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Database connected successfully");
    release(); // release the client back to the pool
  }
});

export default pool;
