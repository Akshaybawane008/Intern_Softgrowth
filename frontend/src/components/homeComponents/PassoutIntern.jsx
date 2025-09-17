import { useState, useEffect } from "react";

const PassoutIntern = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Filter tasks by status "completed" + search
  useEffect(() => {
    const filtered = tasks
      .filter((task) => task.statusbar === "completed")
      .filter((task) =>
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Completed Intern Tasks</h2>

        {/* Search and rows per page */}
        <div className="flex flex-row justify-between items-center mb-4 gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by task title, assigned name..."
            className="border p-2 rounded-lg w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex justify-end mb-3">
            <label className="mr-2 font-medium mt-2">Rows per page:</label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 rounded-lg"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {currentRecords.length === 0 ? (
          <p className="text-center text-gray-600">No completed tasks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Assigned To</th>
                  <th className="border p-2">Task Title</th>
                  <th className="border p-2">Due Date</th>
                  <th className="border p-2">Attachments</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((task, i) => (
                  <tr key={task._id || i} className="text-center hover:bg-gray-50">
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{task.assignedTo?.name || "N/A"}</td>
                    <td className="border p-2">{task.assignTask || task.title || "-"}</td>
                    <td className="border p-2">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="border p-2">
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
                    <td className="border p-2 capitalize">{task.statusbar || "-"}</td>
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
              className="px-3 py-1 border rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassoutIntern;
