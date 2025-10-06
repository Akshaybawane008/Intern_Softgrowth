import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, CheckCircle2, Download, User } from "lucide-react";

const PassoutIntern = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();

  // Filter tasks by status "completed" + search
  useEffect(() => {
    const filtered = tasks
      .filter((task) => task.statusbar === "completed")
      .filter(
        (task) =>
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignTask?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignedTo?.some((u) =>
            `${u.name} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTasks.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredTasks.length / recordsPerPage);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-emerald-600 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent">
            Completed Tasks
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          View all successfully completed intern tasks and projects
        </p>
      </div>

      {/* Controls Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by task title, assigned name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                       placeholder-gray-500 dark:placeholder-gray-400 text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Records per page */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Filter className="text-gray-400 w-4 h-4" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Rows:
            </label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Mobile Cards */}
        <div className="block lg:hidden">
          {currentRecords.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No completed tasks found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                All completed tasks will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-3">
              {currentRecords.map((task, i) => (
                <div key={task._id || i} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {task.assignTask || task.title || "Untitled Task"}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/task/${task._id}`)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors ml-2"
                      title="View Details"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Assigned to:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {task.assignedTo && task.assignedTo.length > 0
                          ? task.assignedTo.map((user) => `${user.name} ${user.lastName}`).join(", ")
                          : "Unassigned"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Due Date: </span>
                        <span className="text-gray-900 dark:text-white">
                          {task.deadline
                            ? new Date(task.deadline).toLocaleDateString()
                            : "No deadline"}
                        </span>
                      </div>
                    </div>

                    {task.attachments && task.attachments.length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Attachments: </span>
                        <div className="mt-1 space-y-1">
                          {task.attachments.map((file, idx) => (
                            <a
                              key={idx}
                              href={file}
                              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-xs"
                              download
                            >
                              <Download className="w-3 h-3" />
                              {file.split("/").pop()}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          {currentRecords.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No completed tasks found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                All completed tasks will appear here
              </p>
            </div>
          ) : (
            <table className="w-full min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    #
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Assigned To
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Task Title
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Due Date
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Attachments
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((task, i) => (
                  <tr key={task._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm">
                      {indexOfFirstRecord + i + 1}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>
                          {task.assignedTo && task.assignedTo.length > 0
                            ? task.assignedTo.map((user) => `${user.name} ${user.lastName}`).join(", ")
                            : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm font-medium">
                      {task.assignTask || task.title || "-"}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm">
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm">
                      {task.attachments && task.attachments.length > 0 ? (
                        <div className="space-y-1">
                          {task.attachments.map((file, idx) => (
                            <a
                              key={idx}
                              href={file}
                              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-xs"
                              download
                            >
                              <Download className="w-3 h-3" />
                              {file.split("/").pop()}
                            </a>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <button
                        onClick={() => navigate(`/admin/task/${task._id}`)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 
                                 text-white rounded transition-colors text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 dark:border-gray-600 p-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredTasks.length)} of{" "}
                {filteredTasks.length} completed tasks
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 border rounded text-xs font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassoutIntern;