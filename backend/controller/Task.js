import mongoose from "mongoose";
import { Task } from "../model/Task.js";
import { publicDecrypt } from "crypto";
import { get } from "http";


//method post
//routes
// api/intern/task
export const createTask = async (req, res) => {
    console.log(req.body)

    const { assignedTo, name, assignTask, attachments, remark, deadline } = req.body;

    // validation
    if (!assignedTo || !name || !assignTask || !remark || !deadline || !attachments) {
        return res.status(400).json({ message: "All fields are required" });
    }



    try {
        const task = await Task.create({
            assignedTo,
            name,
            assignTask,
            attachments,
            remark,
            deadline
        });
        await task.save();
        res.json({ message: "Task Assigned successfully", task: task });
    } catch (err) {
        res.status(400).json({ message: "Error fetching tasks", error: err.message });
    }
}

//method get
//routes
// api/intern/task
export const getAllTask = async (req, res) => {

    try {
        let tasks = await Task.find()
        if (tasks.length === 0) {
            return res.status(404).json({ message: "No task found", success: false })
        }
        res.json({ message: "All tasks fetched successfully", tasks: tasks, success: true });
    } catch (err) {
        res.status(400).json({ message: "Error fetching tasks", error: err.message });
    }

}


// ===================== not test api below plz check it on postman ==============

// update task by id 
//method put
//routes
// api/intern/task/:id
export const updateTaskById = async (req, res) => {
    const id = req.params.id
    console.log(req.body)
    const { name, assignTask, attachments, remark, deadline } = req.body;
    const updatetask = await Task.findByIdAndUpdate(id,
        { name, assignTask, attachments, remark, deadline },
        { new: true })
    if (!updatetask) return res.json({ message: "task not found", success: false })
    res.json({ message: "task update successfully", updatetask, success: true })

};



// method get task by id 
// /api/intern/task/:id
export const getTaskById = async (req, res) => {
    const id = req.params.id;
    console.log("your task id :", id)
    const task = await Task.findById(id).populate("assignedTo");

    if (!task) return res.json({ message: "task not found", success: false })
    res.json({ message: "Task fetched successfully", task, success: true })
}
// method delete task by id 
// api/intern/task/:id
export const deleteTaskById = async (req, res) => {
    const id = req.params.id;
    console.log("your task id :", id)
    const deletetask = await Task.findByIdAndDelete(id)
    if (!deletetask) return res.json({ message: "task not found", success: false })
    res.json({ message: "Task delete successfully", deletetask, success: true })
}


    // method get
    // // get specific user  how many tasks that user have assigned
    // routes 
    // /api/intern/:id/tasks

export const getAllTasksByUserId = async (req, res) => {
   const id = req.params.id;
   console.log("your user id :", id)
   const tasks = await Task.find({assignedTo: id}).populate("assignedTo");
   if (!tasks) return res.json({ message: "No tasks found for this user", success: false })
   res.json({ message: "Tasks fetched successfully", tasks, success: true })
}