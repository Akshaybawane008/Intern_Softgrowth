import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type:String,required:true},
    assignTask: {type:String,required:true},
    attachments: [{ type: String }], // Array of file paths or URLs
    remark: {type:String,required:true},
    deadline: {type:Date,required:true}
})

export const Task = mongoose.model("task",taskSchema)