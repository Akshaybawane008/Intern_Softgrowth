import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, FileText, Calendar, User, Eye, Download } from "lucide-react";

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
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/intern/assignedtasks`, {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) =>
    [task.assignedTo?.name, task.assignTask, task.remark, task.statusbar]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inprogress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View all your assigned tasks and their status
            </p>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 mt-4 lg:mt-0 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tasks.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
              </div>
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {tasks.filter(t => t.statusbar?.toLowerCase() === 'completed').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl  mb-6 border border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by task, remark, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      Student
                    </div>
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Task Description
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      Attachments
                    </div>
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Deadline
                    </div>
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <tr 
                      key={task._id || index} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="border border-gray-300 dark:border-gray-600 px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {index + 1}
                        </div>
                      </td>
                      
                      <td className="border border-gray-300 dark:border-gray-600 px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {task.assignedTo && task.assignedTo.length > 0
                            ? task.assignedTo.map((user) => (
                                <div key={user._id} className="flex items-center gap-2 mb-1 last:mb-0">
                                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <User size={12} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span>{user.name} {user.lastName}</span>
                                </div>
                              ))
                            : "-"}
                        </div>
                      </td>
                      
                      <td className="border border-gray-300 dark:border-gray-600 px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                          {task.assignTask || "-"}
                        </div>
                      </td>
                      
                      <td className="border border-gray-300 dark:border-gray-600 px-6 py-4">
                        <div className="space-y-1">
                          {task.attachments && task.attachments.length > 0 ? (
                            task.attachments.map((file, i) => (
                              <a
                                key={i}
                                href={file}
                                download
                                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-1 rounded"
                              >
                                <Download size={14} />
                                <span className="max-w-xs truncate">
                                  {file.split("/").pop()}
                                </span>
                              </a>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="border border-gray-300 dark:border-gray-600 px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                          {task.remark || "-"}
                        </div>
                      </td>
                      
                      <td className="border border-gray-300 dark:border-gray-600 px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                        </div>
                      </td>
                      
                      <td className="border border-gray-300 dark:border-gray-600 px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.statusbar)}`}>
                          {task.statusbar || "Unknown"}
                        </span>
                      </td>
                      
                      <td className="border border-gray-300 dark:border-gray-600 px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/intern/task/${task._id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="border border-gray-300 dark:border-gray-600 px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <FileText size={48} className="mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                        <p>
                          {searchTerm 
                            ? "No tasks match your search criteria" 
                            : "No tasks have been assigned yet"}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
                      {/* Mobile Card View for Tasks Table */}
<div className="block lg:hidden">
  {filteredTasks.length > 0 ? (
    filteredTasks.map((task, index) => (
      <div
        key={task._id || index}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 shadow-sm"
      >
        {/* Task # */}
        <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold">#{index + 1}</span>
        </div>

        {/* Assigned To */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Student</p>
          {task.assignedTo && task.assignedTo.length > 0 ? (
            <div className="text-sm text-gray-900 dark:text-white">
              {task.assignedTo.map((user) => (
                <div key={user._id} className="flex items-center gap-2 mb-1 last:mb-0">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User size={12} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>{user.name} {user.lastName}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 text-sm">-</span>
          )}
        </div>

        {/* Task Description */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Task Description</p>
          <p className="text-sm text-gray-900 dark:text-white">{task.assignTask || "-"}</p>
        </div>

        {/* Attachments */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Attachments</p>
          {task.attachments && task.attachments.length > 0 ? (
            <div className="space-y-1">
              {task.attachments.map((file, i) => (
                <a
                  key={i}
                  href={file}
                  download
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-1 rounded"
                >
                  <Download size={14} />
                  <span className="truncate max-w-xs">{file.split("/").pop()}</span>
                </a>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 text-sm">-</span>
          )}
        </div>

        {/* Remarks */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Remarks</p>
          <p className="text-sm text-gray-900 dark:text-white">{task.remark || "-"}</p>
        </div>

        {/* Deadline */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Deadline</p>
          <p className="text-sm text-gray-900 dark:text-white">
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
          </p>
        </div>

        {/* Status */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Status</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.statusbar)}`}>
            {task.statusbar || "Unknown"}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-3">
          <button
            onClick={() => navigate(`/intern/task/${task._id}`)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View
          </button>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
      <FileText size={48} className="mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
      <p>{searchTerm ? "No tasks match your search criteria" : "No tasks have been assigned yet"}</p>
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Search
        </button>
      )}
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default IntenRecord;