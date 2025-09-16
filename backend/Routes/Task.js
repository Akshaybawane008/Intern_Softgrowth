import express from "express";
import { createTask, getAllTask, getTaskById,deleteTaskById, updateTaskById, getAllTasksByUserId } from "../controller/Task.js";
import { isauthenticated } from "../middelware/Auth.js";

const router = express.Router();

// Add task
// POST -> api/intern/task
router.post("/task",isauthenticated, createTask);

// Get all tasks
// GET -> api/intern/task
router.get("/tasks",isauthenticated, getAllTask);

router.get("/task/:id",isauthenticated, getTaskById)
router.put("/task/update/:id",isauthenticated, updateTaskById)
router.delete("/task/:id",isauthenticated, deleteTaskById)

// get specific user  how many tasks that user have assigned
router.get("/assignedtasks",isauthenticated, getAllTasksByUserId)

export default router;
