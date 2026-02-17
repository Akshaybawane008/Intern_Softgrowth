import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Person,
  Assignment,
  Attachment,
  Comment,
  Event,
  Update,
  Delete,
  Add
} from "@mui/icons-material";

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [remark, setRemark] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [oldAttachments, setOldAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const authData = localStorage.getItem("auth");
        const parsed = authData ? JSON.parse(authData) : null;
        const token = parsed?.token;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/intern/task/${id}`, {
          headers: { auth: token },
        });
        const data = await res.json();

        if (data.success) {
          const task = data.task;
          setTaskText(task.assignTask || "");
          setRemark(task.remark || "");
          setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
          const assignedNames = task.assignedTo.map((s) => `${s.name} ${s.lastName}`);
          setSelectedOptions(assignedNames);
          setOldAttachments(task.attachments || []);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (event) => {
    const { target: { value } } = event;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleRemoveOldAttachment = (index) => {
    setOldAttachments(oldAttachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!taskText || !remark || !deadline || selectedOptions.length === 0) {
      alert("Please fill all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("assignTask", taskText);
      formData.append("remark", remark);
      formData.append("deadline", deadline);

      const studentIds = selectedOptions
        .map((opt) => {
          const student = students.find((s) => `${s.name} ${s.lastName}` === opt);
          return student?._id;
        })
        .filter(Boolean);

      formData.append("assignedTo", studentIds.join(","));
      formData.append("oldAttachments", oldAttachments.join(","));

      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }

      const authData = localStorage.getItem("auth");
      const parsed = authData ? JSON.parse(authData) : null;
      const token = parsed?.token;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/intern/task/update/${id}`, {
        method: "PUT",
        body: formData,
        headers: { auth: token },
      });

      const data = await response.json();
      console.log("Task updated:", data);

      if (data.success) {
        alert("Task updated successfully!");
        navigate("/admin/taskrecords");
      } else {
        alert(data.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/taskrecords")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ArrowBack className="text-lg" />
              <span className="font-medium">Back to Tasks</span>
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Update Task</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Student Selection */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <Person className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Assign to Students
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Select team members for this task</p>
                </div>
              </div>
              <FormControl fullWidth className="bg-gray-50 dark:bg-gray-700 rounded-xl">
                <InputLabel 
                  id="multi-select-label"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Choose Students
                </InputLabel>
                <Select
                  labelId="multi-select-label"
                  multiple
                  value={selectedOptions}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <div className="flex flex-wrap gap-2">
                      {selected.map((value, index) => (
                        <span 
                          key={index}
                          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                        >
                          <Person className="text-xs" />
                          {value}
                        </span>
                      ))}
                    </div>
                  )}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid #3b82f6',
                    },
                    borderRadius: '12px',
                  }}
                >
                  {students.map((student) => (
                    <MenuItem
                      key={student._id}
                      value={`${student.name} ${student.lastName}`}
                      className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Person className="text-green-600 dark:text-green-400 text-sm" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {student.name} {student.lastName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {student.email}
                        </div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Task Description */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <Assignment className="text-green-600 dark:text-green-400 text-lg" />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Task Description
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Describe what needs to be done</p>
                </div>
              </div>
              <textarea
                rows="4"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Enter detailed task description..."
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            {/* Attachments Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                  <Attachment className="text-orange-600 dark:text-orange-400 text-lg" />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Attachments
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add or remove files</p>
                </div>
              </div>

              {/* Existing Attachments */}
              {oldAttachments.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Current Files:</h4>
                  <div className="space-y-2">
                    {oldAttachments.map((file, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-2">
                          <Attachment className="text-gray-400 text-sm" />
                          <a
                            href={`${import.meta.env.VITE_BACKEND_URL}/uploads/${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            {file}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveOldAttachment(idx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Delete className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Attachments */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4 file:rounded-lg
                    file:border-0 file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-300
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-800
                    cursor-pointer"
                />
              </div>
            </div>

            {/* Remark */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <Comment className="text-purple-600 dark:text-purple-400 text-lg" />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Remarks
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Additional notes or comments</p>
                </div>
              </div>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter any additional remarks..."
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            {/* Deadline */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                  <Event className="text-red-600 dark:text-red-400 text-lg" />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Deadline
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Set the completion date</p>
                </div>
              </div>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/admin/taskrecords")}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                <ArrowBack className="text-lg" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Update className="text-lg" />
                {isSubmitting ? "Updating..." : "Update Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;