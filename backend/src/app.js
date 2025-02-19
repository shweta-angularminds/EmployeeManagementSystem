import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS middleware configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL (can also use process.env.CORS_ORIGIN)
    credentials: true, // Allow cookies to be sent and received
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
import employeeRouter from "./routes/employee.router.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/employee", employeeRouter);
// Export the app
export { app };
