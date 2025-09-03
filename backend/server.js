import express from "express"
import bodyParser from "express";
import mongoose from "mongoose";
import useRouter from "./Routes/user.js"
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
//   server port number
const port = 4000;

// mongodb database connection
mongoose.connect("mongodb+srv://jrsahil24:ECG7sbLpbFnWigbv@cluster0.1rd532c.mongodb.net/",
    { dbName: "intern_Task_management" }
).then(() => console.log("mongo db connected successfully")).catch((error) => console.log(error = error.message));

app.use("/api/user/",useRouter);

app.get("/", (req, res) => {
    res.end("hello sahil")
})



app.listen(port, () => console.log(`server is listening on port ${port}`))