import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import todoRouter from "./routes/todoRouter.js";
import userRouter from "./routes/userRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the todoRouter for all task-related routes
app.use("/", todoRouter);
app.use("/user", userRouter);

// Error-handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    error: error.message ,
  });
});

// Start the server
app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on http://localhost:${port}`
  );
});
