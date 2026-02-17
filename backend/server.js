import express from "express"
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoutes from "./Routes/user.js"
import taskRoutes from "./Routes/Task.js"
import cors from "cors"
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL, // replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(fileUpload()); // enable file upload
// serve static files
app.use("/assets", express.static(path.join(__dirname, "assets")));

//   server port number
const port = process.env.PORT || 4000;

// mongodb database connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME
}).then(() => console.log("mongo db connected successfully")).catch((error) => console.log(error.message));

app.use("/api/users",userRoutes);
app.use("/api/intern",taskRoutes);

app.get("/", (req, res) => {
    res.end("hello sahil")
})



app.listen(port, () => console.log(`server is listening on port ${port}`))