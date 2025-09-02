import express from "express"
import bodyParser from "express";

import cors from "cors"
const app = express()
app.use(cors({
    origin: "http://localhost:5173", // replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

// Routes
app.use("/api/user", userRouters);

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
