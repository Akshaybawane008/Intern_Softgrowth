import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoutes from "./Routes/user.js"
import taskRoutes from "./Routes/Task.js"
import cors from "cors"
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors({
    origin: "http://localhost:5173", // replace with your frontend URL
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
const port = 4000;

// mongodb database connection
mongoose.connect("mongodb+srv://jrsahil24_db_user:MzXofG2cvAmOGs6D@cluster0.ldfequw.mongodb.net/",
    { dbName: "intern_Task_management" }
).then(() => console.log("mongo db connected successfully")).catch((error) => console.log(error = error.message));

app.use("/api/users",userRoutes);
app.use("/api/intern",taskRoutes);

app.get("/", (req, res) => {
    res.end("hello sahil")
})



app.listen(port, () => console.log(`server is listening on port ${port}`))