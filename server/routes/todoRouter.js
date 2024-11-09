import express from "express";
import pool from "../helpers/db.js";
import { emptyOrRows } from "../helpers/utils.js";
import {auth} from '../helpers/auth.js'

const router = express.Router();

// GET all tasks
router.get("/", async (req, res, next) => {
 pool.query("select * from task", (error, result) => {
    if (error) return next(error);
    return res.status(200).json(emptyOrRows(result));
  });
});

// POST a new task
// router.post("/create", auth,(req, res, next) => {
//   pool.query('insert into task (description) values ($1) returning *', [req.body.description], (error, result) => {
//     if (error) return next(error);
//     return res.status(201).json({ id: result.rows[0].id });
//   });
// });
router.post("/create", auth, (req, res, next) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" }); // Proper validation for bad input
  }

  pool.query(
    "INSERT INTO task (description) VALUES ($1) RETURNING *",
    [description],
    (error, result) => {
      if (error) return next(error);
      return res.status(201).json({ id: result.rows[0].id });
    }
  );
});



// DELETE a task
router.delete("/delete/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query("DELETE FROM task WHERE id = $1", [id]);
    res.status(200).json({ message: `Task ${id} deleted` });
  } catch (error) {
    next(error);
  }
});

export default router;
