import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state
  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    const parsed = authData ? JSON.parse(authData) : null;
    const token = parsed?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:4000/api/intern/tasks", {
        headers: { auth: token },
      })
      .then((response) => {
        setTasks(response.data.tasks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        navigate("/login");
      });
  }, [navigate]);

  const handleDelete = async (taskId) => {
    try {
      const authData = localStorage.getItem("auth");
      const parsed = authData ? JSON.parse(authData) : null;
      const token = parsed?.token;
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:4000/api/intern/task/${taskId}`, {
        headers: { auth: token },
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      navigate("/login");
    }
  };

  // ✅ Filter tasks based on search term
  const filteredTasks = tasks.filter((task) => {
    const studentNames = task.assignedTo
      ?.map((u) => `${u.name} ${u.lastName}`)
      .join(", ")
      .toLowerCase() || "";
    const taskName = task.assignTask?.toLowerCase() || "";
    const status = task.statusbar?.toLowerCase() || "";
    const remark = task.remark?.toLowerCase() || "";
    const deadline = task.deadline
      ? new Date(task.deadline).toLocaleDateString().toLowerCase()
      : "";
    const attachmentNames = task.attachments
      ?.map((file) => file.split("/").pop().toLowerCase())
      .join(", ") || "";

    const term = searchTerm.toLowerCase();

    return (
      studentNames.includes(term) ||
      taskName.includes(term) ||
      status.includes(term) ||
      remark.includes(term) ||
      deadline.includes(term) ||
      attachmentNames.includes(term)
    );
  });

  if (loading) {
    return <p className="p-4 dark:text-gray-200">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Assigned Tasks
      </h2>

      {/* ✅ Search Input */}
      <input
        type="text"
        placeholder="Search by name, task, status, remark, file, or date..."
        className="mb-4 p-2 w-1/3 border rounded hover:outline-1 outline-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">Student</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">Task</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">File</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">Remark</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">Date</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">Status</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">Details</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">Edit</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <tr
                key={task._id || index}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {index + 1}
                </td>
                <td className="border truncate border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {task.assignedTo && task.assignedTo.length > 0
                    ? task.assignedTo
                        .map((user) => `${user.name} ${user.lastName}`)
                        .join(", ")
                    : "-"}
                </td>
                <td className="border truncate border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {task.assignTask || "-"}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {task.attachments && task.attachments.length > 0 ? (
                    task.attachments.map((file, i) => (
                      <a
                        key={i}
                        href={file}
                        className="text-blue-500 dark:text-blue-400 underline block"
                        download
                      >
                        {file.split("/").pop()}
                      </a>
                    ))
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border truncate border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {task.remark || "-"}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {task.statusbar || "-"}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                  <button
                    onClick={() => navigate(`/admin/task/${task._id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                  <button
                    onClick={() => navigate(`/admin/update/task/${task._id}`)}
                    className="px-3 mx-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Update
                  </button>
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="10"
                className="text-center py-4 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              >
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
