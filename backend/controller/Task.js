import { Task } from "../model/Task.js";


//method post
//routes
// api/intern/task


export const createTask = async (req, res) => {
  try {
    const { assignedTo, assignTask, remark, deadline } = req.body;
       
    let attachments = [];
    if (req.files && req.files.attachments) {
      const files = Array.isArray(req.files.attachments)
        ? req.files.attachments
        : [req.files.attachments];

      files.forEach((file) => {
        const uploadPath = `./assets/img/${file.name}`;
        file.mv(uploadPath); // move file to assets/img

        // ✅ store public path, not ./assets/...
        attachments.push(`/assets/img/${file.name}`);
      });
    }
   const assignedToMany = assignedTo.split(',').map(id => id.trim()); // Convert to array of ObjectIds
   console.log("Assigned To IDs:", assignedToMany);
    const task = await Task.create({
      assignedTo : assignedToMany,
      assignTask,
      attachments, // now stores URLs like "/assets/img/xyz.png"
      remark,
      deadline,
      user: req.user,
    });

    res.json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error });
  }
};



//method get
//routes
// api/intern/tasks
export const getAllTask = async (req, res) => {

  try {
    let tasks = await Task.find().populate("assignedTo");
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
// method: PUT
// route: /api/intern/task/update/:id
export const updateTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("your task id :", id);
    console.log("updated request body:", req.body);
    const { assignedTo } = req.body;
    if (assignedTo) {
      req.body.assignedTo = assignedTo.split(',').map(id => id.trim());
    }
    const updatetask = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate("assignedTo", "name lastName email"); // populate assigned students

    console.log("Updated task:", updatetask);
    if (!updatetask) {
      return res.json({ message: "task not found", success: false });
    }


    res.json({
      message: "task update successfully",
      updatetask: updatetask,
      success: true,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};



// method get task by id 
// /api/intern/task/:id
export const getTaskById = async (req, res) => {
  const id = req.params.id;
  console.log("your task id :", id)
  const task = await Task.findById(id).populate("assignedTo");
  console.log("Fetched task:", task);
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
// /api/intern/assignedtasks/

export const getAllTasksByUserId = async (req, res) => {
  const id = req.user._id;
  console.log("your user id :", id)
  const tasks = await Task.find({ assignedTo: id }).populate("assignedTo");
  if (!tasks) return res.json({ message: "No tasks found for this user", success: false })
  res.json({ message: "Tasks fetched successfully", tasks, success: true })
}