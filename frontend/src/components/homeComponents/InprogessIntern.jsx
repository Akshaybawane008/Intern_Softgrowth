import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InprogressIntern = ({ tasks }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Filter tasks by status "inprogress" + search
  useEffect(() => {
    const filtered = tasks
      .filter((task) => task.statusbar === "inprogress")
      .filter(
        (task) =>
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignTask?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTasks.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredTasks.length / recordsPerPage);

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Inprogress Intern Tasks
        </h2>

        {/* Search and rows per page */}
        <div className="flex flex-row justify-between items-center mb-4 gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by task title, assigned name..."
            className="border p-2 rounded-lg w-full md:w-1/3 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex justify-end mb-3">
            <label className="mr-2 font-medium mt-2 text-gray-700 dark:text-gray-300">
              Rows per page:
            </label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {currentRecords.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No in-progress tasks found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr className="text-gray-900 dark:text-gray-100">
                  <th className="border p-2 dark:border-gray-600">No</th>
                  <th className="border p-2 dark:border-gray-600">Assigned To</th>
                  <th className="border p-2 dark:border-gray-600">Task Title</th>
                  <th className="border p-2 dark:border-gray-600">Due Date</th>
                  <th className="border p-2 dark:border-gray-600">Attachments</th>
                  <th className="border p-2 dark:border-gray-600">Status</th>
                  <th className="border p-2 dark:border-gray-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((task, i) => (
                  <tr
                    key={task._id || i}
                    className="text-center hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                  >
                    <td className="border p-2 dark:border-gray-600">{i + 1}</td>
                     <td className="text-overflow border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {task.assignedTo && task.assignedTo.length > 0
                    ? task.assignedTo
                        .map((user) => `${user.name} ${user.lastName}`)
                        .join(", ")
                    : "-"}
                </td>
                    <td className="border p-2 dark:border-gray-600">{task.assignTask || task.title || "-"}</td>
                     <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "-"}
                </td>
                    <td className="border p-2 dark:border-gray-600">
                      {task.attachments && task.attachments.length > 0 ? (
                        task.attachments.map((file, idx) => (
                          <a
                            key={idx}
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
                    <td className="border p-2 capitalize dark:border-gray-600">
                      {task.statusbar || "-"}
                    </td>
                    <td className="border px-4 py-2 dark:border-gray-600">
                      <button
                        onClick={() => navigate(`/admin/task/${task._id}`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InprogressIntern;
