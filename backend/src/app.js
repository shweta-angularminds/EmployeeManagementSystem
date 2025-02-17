import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS middleware configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Middleware for handling JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Simple route to check if the server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Auth routes
import authRouter from "./routes/auth.router.js";
app.use("/api/v1/auth", authRouter);

// Export the app
export { app };
