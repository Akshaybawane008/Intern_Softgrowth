import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const Task = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [remark, setRemark] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users");
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskText || !remark || !deadline || selectedOptions.length === 0) {
      alert("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("assignTask", taskText);
      formData.append("remark", remark);
      formData.append("deadline", deadline);

      const studentIds = selectedOptions
        .map((opt) => {
          const student = students.find(
            (s) => `${s.name} ${s.lastName}` === opt
          );
          return student?._id;
        })
        .filter(Boolean);

      formData.append("assignedTo", studentIds.join(","));

      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }

      const authData = localStorage.getItem("auth");
      const parsed = authData ? JSON.parse(authData) : null;
      const token = parsed?.token;

      const response = await fetch("http://localhost:4000/api/intern/task", {
        method: "POST",
        body: formData,
        headers: { auth: token },
      });

      const data = await response.json();
      console.log("Task created:", data);
      alert("Task created successfully!");

      // reset form
      setSelectedOptions([]);
      setTaskText("");
      setRemark("");
      setDeadline("");
      setAttachments([]);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  return (
    <div className=" min-h-screen flex justify-center items-start bg-gray-100 dark:bg-gray-900 transition-colors p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[600px] p-6 shadow-xl rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
      >
        <h2 className="text-2xl font-semibold text-center mb-5">
          Assign Tasks
        </h2>

        <FormControl fullWidth className="mb-5">
          <InputLabel id="multi-select-label">Select Student</InputLabel>
          <Select
            labelId="multi-select-label"
            multiple
            value={selectedOptions}
            onChange={handleChange}
            renderValue={(selected) => selected.join(", ")}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {students.map((student) => (
              <MenuItem
                key={student._id}
                value={`${student.name} ${student.lastName}`}
              >
                {student.name} {student.lastName} ({student.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <textarea
          rows="4"
          name="task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Assign a Task"
          className="block w-full mb-5 p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors"
          required
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full mb-5 p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors"
        />

        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Remark"
          className="block w-full mb-5 p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors"
          required
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="block w-full mb-5 p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors"
          required
        />

        <button
          type="submit"
          className="text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 w-full py-2.5 rounded-lg transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Task;
