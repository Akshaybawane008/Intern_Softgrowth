import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  Delete,
  Download,
  Person,
  Assignment,
  Attachment,
  Comment,
  Event,
  Refresh,
  Add
} from "@mui/icons-material";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    const authData = localStorage.getItem("auth");
    const parsed = authData ? JSON.parse(authData) : null;
    const token = parsed?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/intern/tasks`, {
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
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const authData = localStorage.getItem("auth");
      const parsed = authData ? JSON.parse(authData) : null;
      const token = parsed?.token;
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/intern/task/${taskId}`, {
        headers: { auth: token },
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
      case "in progress":
        return "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
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

      const matchesSearch = 
        studentNames.includes(term) ||
        taskName.includes(term) ||
        status.includes(term) ||
        remark.includes(term) ||
        deadline.includes(term) ||
        attachmentNames.includes(term);

      const matchesFilter = 
        filterStatus === "all" || 
        task.statusbar?.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "deadline":
          return new Date(a.deadline || 0) - new Date(b.deadline || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Task Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track all assigned tasks
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <button
              onClick={fetchTasks}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Refresh className="text-lg" />
              Refresh
            </button>
            <button
              onClick={() => navigate("/admin/task")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white border border-blue-700 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Add className="text-lg" />
              New Task
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search tasks, students, remarks..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <select
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:text-white appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:text-white appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="deadline">By Deadline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Table with Borders */}
        <div className=" lg:dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                  <th className="border-r border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Task Details
                  </th>
                  <th className="border-r border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="border-r border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="border-r border-gray-300 dark:border-gray-600 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <tr 
                      key={task._id} 
                      className={`border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <td className="border-r border-gray-300 dark:border-gray-600 px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-800">
                            <Assignment className="text-blue-600 dark:text-blue-400 text-sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                              {task.assignTask || "Untitled Task"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {task.remark || "No description"}
                            </p>
                            {task.attachments && task.attachments.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Attachment className="text-xs" />
                                {task.attachments.length} file(s) attached
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border-r border-gray-300 dark:border-gray-600 px-6 py-4">
                        <div className="space-y-2">
                          {task.assignedTo && task.assignedTo.length > 0 ? (
                            task.assignedTo.slice(0, 3).map((user, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center border border-green-200 dark:border-green-800">
                                  <Person className="text-green-600 dark:text-green-400 text-xs" />
                                </div>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {user.name} {user.lastName}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">Not assigned</span>
                          )}
                          {task.assignedTo && task.assignedTo.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 pl-8">
                              +{task.assignedTo.length - 3} more
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border-r border-gray-300 dark:border-gray-600 px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <Event className="text-gray-400 text-sm" />
                          {task.deadline ? (
                            <span className={new Date(task.deadline) < new Date() && task.statusbar?.toLowerCase() !== 'completed' ? 'text-red-600 dark:text-red-400' : ''}>
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          ) : (
                            "No deadline"
                          )}
                        </div>
                      </td>
                      <td className="border-r border-gray-300 dark:border-gray-600 px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.statusbar)}`}>
                          {task.statusbar || "Not Started"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/task/${task._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800 transition-colors duration-200"
                            title="View Details"
                          >
                            <Visibility className="text-lg" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/update/task/${task._id}`)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded border border-green-200 dark:border-green-800 transition-colors duration-200"
                            title="Edit Task"
                          >
                            <Edit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded border border-red-200 dark:border-red-800 transition-colors duration-200"
                            title="Delete Task"
                          >
                            <Delete className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Assignment className="text-gray-400 text-4xl mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No tasks found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                          {searchTerm || filterStatus !== "all" 
                            ? "No tasks match your search criteria. Try adjusting your filters." 
                            : "Get started by creating your first task assignment."}
                        </p>
                        {(searchTerm || filterStatus !== "all") && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setFilterStatus("all");
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-700"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
  

          </div>
                    {/* Mobile Card View */}
<div className="block   lg:hidden ">
  {filteredTasks.length > 0 ? (
    filteredTasks.map((task) => (
      <div
            key={task._id}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 gap"
      >
        <div className="mb-3 ">
          <p className="text-xs font-semibold text-gray-500">Task</p>
          <p className="text-gray-900 dark:text-white font-medium">
            {task.assignTask || "Untitled Task"}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500">Assigned To</p>
          {task.assignedTo?.length > 0 ? (
            <p className="text-gray-900 dark:text-white">
              {task.assignedTo.map(u => `${u.name} ${u.lastName}`).join(", ")}
            </p>
          ) : (
            <p className="text-gray-500">Not Assigned</p>
          )}
        </div>

        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500">Deadline</p>
          <p className="text-gray-900 dark:text-white">
            {task.deadline
              ? new Date(task.deadline).toLocaleDateString()
              : "No deadline"}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.statusbar)}`}
          >
            {task.statusbar || "Not Started"}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => navigate(`/admin/task/${task._id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800 transition"
          >
            <Visibility />
          </button>
          <button
            onClick={() => navigate(`/admin/update/task/${task._id}`)}
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded border border-green-200 dark:border-green-800 transition"
          >
            <Edit />
          </button>
          <button
            onClick={() => handleDelete(task._id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded border border-red-200 dark:border-red-800 transition"
          >
            <Delete />
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 dark:text-gray-400 py-6">
      No tasks found
    </p>
  )}
</div>
        </div>

        {/* Footer Info */}
        {filteredTasks.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div>
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredTasks.length}</span> of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{tasks.length}</span> tasks
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Completed: {tasks.filter(t => t.statusbar?.toLowerCase() === 'completed').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span>In Progress: {tasks.filter(t => t.statusbar?.toLowerCase() === 'in progress').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>Pending: {tasks.filter(t => t.statusbar?.toLowerCase() === 'pending').length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;