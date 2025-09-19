import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useParams, useNavigate } from "react-router-dom";

const UpdateTask = () => {
  const { id } = useParams(); // Task ID from URL
  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [remark, setRemark] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [oldAttachments, setOldAttachments] = useState([]); // preview existing files

  // ✅ Fetch students
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

  // ✅ Fetch task details for prefill
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const authData = localStorage.getItem("auth");
        const parsed = authData ? JSON.parse(authData) : null;
        const token = parsed?.token;

        const res = await fetch(`http://localhost:4000/api/intern/task/${id}`, {
          headers: { auth: token },
        });
        const data = await res.json();

        if (data.success) {
          const task = data.task;

          setTaskText(task.assignTask || "");
          setRemark(task.remark || "");
          setDeadline(task.deadline ? task.deadline.split("T")[0] : "");

          // Prefill assigned students
          const assignedNames = task.assignedTo.map((s) => `${s.name} ${s.lastName}`);
          setSelectedOptions(assignedNames);

          // Show existing attachments if backend returns them
          setOldAttachments(task.attachments || []);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    fetchTask();
  }, [id]);

  // ✅ Handle student selection
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  // ✅ Handle new file uploads
  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  // ✅ Handle update
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

      // Send student IDs, not names
      const studentIds = selectedOptions
        .map((opt) => {
          const student = students.find(
            (s) => `${s.name} ${s.lastName}` === opt
          );
          return student?._id;
        })
        .filter(Boolean);

      formData.append("assignedTo", studentIds.join(",")); // backend splits string

      // Attach new files
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }

      const authData = localStorage.getItem("auth");
      const parsed = authData ? JSON.parse(authData) : null;
      const token = parsed?.token;

      const response = await fetch(
        `http://localhost:4000/api/intern/task/update/${id}`,
        {
          method: "PUT",
          body: formData,
          headers: { auth: token },
        }
      );

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
    }
  };

  return (
    <div className="mt-[80px]">
      <form
        onSubmit={handleSubmit}
        className="w-auto max-w-[600px] p-6 bg-gray-50 shadow-xl mx-auto"
      >
        <h2 className="text-2xl font-semibold text-center mb-5">
          Update Task
        </h2>

        <FormControl fullWidth className="mb-5">
          <InputLabel id="multi-select-label">Select Student</InputLabel>
          <Select
            labelId="multi-select-label"
            multiple
            value={selectedOptions}
            onChange={handleChange}
            renderValue={(selected) => selected.join(", ")}
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
          className="block w-full mb-5 p-2 border-b-2 border-gray-300"
          required
        />

        {/* Show old attachments */}
        {oldAttachments.length > 0 && (
          <div className="mb-5">
            <p className="font-semibold">Existing Attachments:</p>
            <ul>
              {oldAttachments.map((file, idx) => (
                <li key={idx}>
                  <a
                    href={`http://localhost:4000/uploads/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full mb-5 p-2 border-b-2 border-gray-300"
        />

        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Remark"
          className="block w-full mb-5 p-2 border-b-2 border-gray-300"
          required
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="block w-full mb-5 p-2 border-b-2 border-gray-300"
          required
        />

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/admin/taskrecords")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTask;
