import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IntenRecord = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
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
      .get("http://localhost:4000/api/intern/assignedtasks", {
        headers: { auth: token },
      })
      .then((response) => {
        console.log("all tasks fetched successfully:", response.data.tasks);
        setTasks(response.data.tasks); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        navigate("/login"); 
      });
  }, [navigate]);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  // ✅ Filter only in-progress tasks + apply search
  const filteredTasks = tasks
    .filter((task) => task.statusbar === "inprogress")
    .filter((task) =>
      [task.assignedTo?.name, task.assignTask, task.remark, task.statusbar]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Inprogress Tasks</h2>

      {/* ✅ Search input */}
      <input
        type="text"
        placeholder="Search by student, task, remark or status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Student</th>
            <th className="border border-gray-300 px-4 py-2">Task</th>
            <th className="border border-gray-300 px-4 py-2">File</th>
            <th className="border border-gray-300 px-4 py-2">Remark</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <tr key={task._id || index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{task.assignedTo?.name || "-"}</td>
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
                <td className="border px-4 py-2 capitalize">
                  {task.statusbar || "-"}
                </td>
                   <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/intern/task/${task._id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 border">
                No in-progress tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IntenRecord;
