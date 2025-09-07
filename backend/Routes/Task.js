import express from "express";
import { createTask, getAllTask, getTaskById,deleteTaskById, updateTaskById, getAllTasksByUserId } from "../controller/Task.js";

const router = express.Router();

// Add task
// POST -> api/intern/task
router.post("/task", createTask);

// Get all tasks
// GET -> api/intern/task
router.get("/tasks", getAllTask);

router.get("/task/:id",getTaskById)
router.put("/task/:id",updateTaskById)
router.delete("/task/:id",deleteTaskById)

// get specific user  how many tasks that user have assigned
router.get("/user/:id/tasks",getAllTasksByUserId)

export default router;
