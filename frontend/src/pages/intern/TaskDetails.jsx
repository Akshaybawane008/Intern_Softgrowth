import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth")).token
    : null;

  // Fetch task details
  useEffect(() => {
    if (!token) return;

    axios
      .get(`http://localhost:4000/api/intern/task/${id}`, {
        headers: { auth: token },
      })
      .then((response) => {
        console.log("User task details fetched successfully:", response.data.task);
        setTask(response.data.task);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        setLoading(false);
      });
  }, [id, token]);

  // Handle status change instantly
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setTask((prev) => ({ ...prev, statusbar: newStatus })); // update UI instantly

    axios
      .put(
        `http://localhost:4000/api/intern/task/update/${id}`,
        { statusbar: newStatus },
        { headers: { auth: token } }
      )
      .then((response) => {
        console.log("Status updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  if (loading) {
    return <p className="p-4">Loading task details...</p>;
  }

  if (!task) {
    return <p className="p-4 text-red-500">Task not found</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Task Details</h2>

      <div className="space-y-3">
         {/* ✅ Status Dropdown */}
        <div>
          <strong>Status:</strong>
          <select
            value={task.statusbar || ""}
            onChange={handleStatusChange}
            className="ml-2 border px-3 py-1 rounded"
          >
            <option value="new">New</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <p>
          <strong>Student:</strong> {task.assignedTo?.[0]?.name} {task.assignedTo?.[0]?.lastName || "-"}
        </p>
        <p>
          <strong>Task:</strong> {task.assignTask || "-"}
        </p>
        <p>
          <strong>Remark:</strong> {task.remark || "-"}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "-"}
        </p>

        {/* Attachments */}

<div>
  <strong>Attachments:</strong>
  {task.attachments && task.attachments.length > 0 ? (
    <div className="mt-3 space-y-4">
      {task.attachments.map((file, index) => (
        <div key={index}>
          {/* ✅ Big Image Preview (clickable) */}
          <a
            href={`http://localhost:4000${file}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`http://localhost:4000${file}`}
              alt={`attachment-${index}`}
              className="w-full max-h-[500px] object-contain border rounded-lg shadow-md cursor-pointer hover:opacity-90 transition"
            />
          </a>
        </div>
      ))}
    </div>
  ) : (
    <p>-</p>
  )}
</div>


       
      </div>
    </div>
  );
}

export default TaskDetails;
