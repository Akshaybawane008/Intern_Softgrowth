import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    const parsed = authData ? JSON.parse(authData) : null;
    const token = parsed?.token;

    if (!token) {
      navigate("/login"); // redirect if no token
      return;
    }

    axios
      .get("http://localhost:4000/api/intern/tasks", {
        headers: { auth : token }
      })
      .then((response) => {
        console.log("all tasks fetched successfully:", response.data);
        setTasks(response.data.tasks); // ✅ set tasks not user
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        navigate("/login"); // if token invalid → go login
      });
  }, [navigate]);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2"></th>
            <th className="border border-gray-300 px-4 py-2">Student</th>
            <th className="border border-gray-300 px-4 py-2">Task</th>
            <th className="border border-gray-300 px-4 py-2">File</th>
            <th className="border border-gray-300 px-4 py-2">Remark</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
  {tasks.length > 0 ? (
    tasks.map((task, index) => (
      <tr key={task._id || index}>
        <td className="border px-4 py-2">{index + 1}</td>
        <td className="border px-4 py-2">{task.name || "-"}</td>
        <td className="border px-4 py-2">{task.assignTask || "-"}</td>
        <td className="border px-4 py-2">
          {task.attachments && task.attachments.length > 0 ? (
            task.attachments.map((file, i) => (
              <a
                key={i}
                href={file}
                className="text-blue-500 underline block"
                download
              >
                {file.split("/").pop()}
              </a>
            ))
          ) : (
            "-"
          )}
        </td>
        <td className="border px-4 py-2">{task.remark || "-"}</td>
        <td className="border px-4 py-2">
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "-"}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center py-4 border">
        No tasks assigned
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default TaskTable;
