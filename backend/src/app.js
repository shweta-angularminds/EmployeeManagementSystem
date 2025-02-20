import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running");
});


import authRouter from "./routes/auth.router.js";
import employeeRouter from "./routes/employee.router.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/employee", employeeRouter);

export { app };
