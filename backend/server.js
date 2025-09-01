import express from "express";
import dotenv from "dotenv";             // <--- added
import connectDb from "./dbConfig/dbconfig.js";
import userRouters from "./routes/userRouter.js";

dotenv.config(); // <--- load .env variables

const app = express();
const port = process.env.PORT || 5000;

// Connect to DB
connectDb();

// Middleware
app.use(express.json());

// Routes
app.use("/api/user", userRouters);

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
