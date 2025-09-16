import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    assignTask: {type:String,required:true},
    attachments: [{ type: String }], // Array of file paths or URLs
    remark: {type:String,required:true},
    deadline: {type:Date,required:true},
    user: {type: mongoose.Schema.Types.ObjectId},
    statusbar: {type:String,enum:["new","in-progress","completed"],default:"new"},
    createdAt: {type:Date,default:Date.now}
})

export const Task = mongoose.model("task",taskSchema)