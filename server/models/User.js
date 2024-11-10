import pool from "../helpers/db.js";
import { ApiError } from "../helpers/ApiError.js"; // Ensure you have this error handler

const insertUser = async (email, hashedPassword) => {
  try {
    return await pool.query(
      "INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL code for unique constraint violation
      throw new ApiError("Email already exists.", 400);
    }
    throw error; // Re-throw other unexpected errors
  }
};

const selectUserByEmail = async (email) => {
  return await pool.query("SELECT * FROM account WHERE email=$1", [email]);
};

export { insertUser, selectUserByEmail };

