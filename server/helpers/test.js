// import fs from 'fs';
// import path from 'path';
// import pool from './db.js';
// import { hash } from 'bcrypt';       // Import hash from bcrypt
// import jwt from 'jsonwebtoken';       // Import JWT for generating tokens

// const { sign } = jwt;
// const __dirname = import.meta.dirname

// // Function to initialize the test database
// const initializeTestDb = () => {
//     const sql = fs.readFileSync(path.resolve(__dirname, '../todo.sql'), 'utf-8');
//         pool.query(sql);  // Execute SQL commands to set up the test database
//         console.log("Test database initialized.");
  
// };

// // Function to insert a test user
// const insertTestUser = (email, password) => {
//     hash(password, 10, (error, hashedPassword) => {
//             pool.query('insert into account (email, password) values ($1, $2)', [email, hashedPassword])
//         });
// }

// // Function to get a JWT token for testing
// const getToken = (email) => {   
//     return sign({ user: email }, process.env.JWT_SECRET_KEY);
// };

// export { initializeTestDb, insertTestUser, getToken };

import fs from "fs";
import path from "path";

import pool  from "./db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { hash } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;

// const __dirname = import.meta.dirname;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const initializeTestDb = () => {
  // Read SQL file contents
  const sql = fs.readFileSync(
    path.resolve(__dirname, "../todo.sql"),
    "utf8"
  );

  // Execute the SQL query to initialize the database
  pool.query(sql, (err) => {
    if (err) {
      console.error("Error initializing the database:", err);
      return;
    }
    console.log("Database initialized!");
  });
};
const insertTestUser = async (email, password) => {
  try {
    // Convert hash to Promise and await it
    const hashedPassword = await new Promise((resolve, reject) => {
      hash(password, 10, (error, hash) => {
        if (error) reject(error);
        else resolve(hash);
      });
    });

    // Await the database query
    await pool.query("insert into account (email,password) values ($1,$2)", [
      email,
      hashedPassword,
    ]);

    console.log("SUCCESSFULLY INSERTED USER", email);
  } catch (error) {
    console.log("****Error****", error);
    throw error; // Re-throw the error so the test can catch it
  }
};

const getToken = (email) => {
  return sign({ user: email }, process.env.JWT_SECRET_KEY);
};
export { initializeTestDb, insertTestUser, getToken };