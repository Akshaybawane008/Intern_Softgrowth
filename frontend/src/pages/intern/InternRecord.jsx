import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IntenRecord = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search state
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
      .get("http://localhost:4000/api/intern/assignedtasks", {
        headers: { auth: token },
      })
      .then((response) => {
        setTasks(response.data.tasks); // ✅ set tasks
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        navigate("/login"); // if token invalid → go login
      });
  }, [navigate]);

  if (loading) {
    return <p className="p-4 text-gray-700 dark:text-gray-200">Loading...</p>;
  }

  const filteredTasks = tasks.filter((task) =>
    [task.assignedTo?.name, task.assignTask, task.remark, task.statusbar]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
   <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Assigned Tasks</h2>

    {/* ✅ Search input */}
    <input
      type="text"
      placeholder="Search by student, task, remark or status..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border p-2 mb-4 w-1/2 rounded bg-white dark:bg-gray-800 
                 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
    />

    <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-700">
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">No</th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Student</th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Task</th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">File</th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Remark</th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Date</th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Status</th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Details</th>
        </tr>
      </thead>
      <tbody>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <tr key={task._id || index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">
                {task.assignedTo && task.assignedTo.length > 0
                  ? task.assignedTo.map((user) => `${user.name} ${user.lastName}`).join(", ")
                  : "-"}
              </td>
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
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
              </td>
              <td className="border px-4 py-2">{task.statusbar || "-"}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => navigate(`/intern/task/${task._id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-4 border">
              No tasks found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default IntenRecord;
