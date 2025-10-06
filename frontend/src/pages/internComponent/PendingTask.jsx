import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, FileText, Calendar, User, Eye, Download, Clock, PlayCircle, Hourglass } from "lucide-react";

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
        setTasks(response.data.tasks); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        navigate("/login"); 
      });
  }, [navigate]);

  // Filter in-progress tasks + search
  const filteredTasks = tasks
    .filter((task) => task.statusbar === "inprogress")
    .filter((task) =>
      [task.assignedTo?.name, task.assignTask, task.remark, task.statusbar]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading in-progress tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            In Progress Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tasks you're currently working on - keep up the great work!
          </p>
        </div>
        
        {/* Stats Card */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mt-4 lg:mt-0">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{filteredTasks.length}</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">In Progress</div>
            </div>
            <div className="h-8 w-px bg-orange-200 dark:bg-orange-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {tasks.filter(t => t.statusbar === "inprogress").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search in-progress tasks by student name, task description, or remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Student
                  </div>
                </th>
                <th className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Task Description
                </th>
                <th className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    Attachments
                  </div>
                </th>
                <th className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Deadline
                  </div>
                </th>
                <th className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <PlayCircle size={16} />
                    Status
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <tr 
                    key={task._id || index} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group"
                  >
                    <td className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </div>
                    </td>
                    
                    <td className="border-r border-gray-200 dark:border-gray-600 px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {task.assignedTo && task.assignedTo.length > 0
                          ? task.assignedTo.map((user) => (
                              <div key={user._id} className="flex items-center gap-2 mb-1 last:mb-0">
                                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                                  <User size={12} className="text-orange-600 dark:text-orange-400" />
                                </div>
                                <span>{user.name} {user.lastName}</span>
                              </div>
                            ))
                          : "-"}
                      </div>
                    </td>
                    
                    <td className="border-r border-gray-200 dark:border-gray-600 px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                        {task.assignTask || "-"}
                      </div>
                    </td>
                    
                    <td className="border-r border-gray-200 dark:border-gray-600 px-6 py-4">
                      <div className="space-y-1">
                        {task.attachments && task.attachments.length > 0 ? (
                          task.attachments.map((file, i) => (
                            <a
                              key={i}
                              href={file}
                              download
                              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-1 rounded group/item"
                            >
                              <Download size={14} />
                              <span className="max-w-xs truncate group-hover/item:underline">
                                {file.split("/").pop()}
                              </span>
                            </a>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="border-r border-gray-200 dark:border-gray-600 px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                        {task.remark || "-"}
                      </div>
                    </td>
                    
                    <td className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                      </div>
                    </td>
                    
                    <td className="border-r border-gray-200 dark:border-gray-600 px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-800 animate-pulse">
                        <Clock size={12} className="mr-1" />
                        In Progress
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/intern/task/${task._id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200 text-sm font-medium group/btn hover:shadow-lg"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Hourglass size={48} className="mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No in-progress tasks found</h3>
                      <p className="mb-4">
                        {searchTerm 
                          ? "No in-progress tasks match your search criteria" 
                          : "You don't have any tasks in progress right now"}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
      </div>
    </div>
  );
};

export default IntenRecord;