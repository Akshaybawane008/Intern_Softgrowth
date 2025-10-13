import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, User, FileText, Clock, Download, ArrowLeft } from "lucide-react";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth")).token
    : null;

  // Fetch task details
  useEffect(() => {
    if (!token) return;

    axios
      .get(`http://localhost:4000/api/intern/task/${id}`, {
        headers: { auth: token },
      })
      .then((response) => {
        setTask(response.data.task);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        setLoading(false);
      });
  }, [id, token]);

  // Handle status change instantly
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setTask((prev) => ({ ...prev, statusbar: newStatus }));

    axios
      .put(
        `http://localhost:4000/api/intern/task/update/${id}`,
        { statusbar: newStatus },
        { headers: { auth: token } }
      )
      .then((response) => {
        console.log("Status updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800";
      case "inprogress":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800";
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Task Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400">The requested task could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage task information</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Task Information */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    Task Status
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(task.statusbar)}`}>
                      {task.statusbar || "Unknown"}
                    </span>
                    <select
                      value={task.statusbar || ""}
                      onChange={handleStatusChange}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="new">New</option>
                      <option value="inprogress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Task Details Card */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Task Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Assigned To</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {task.assignedTo?.map(user => `${user.name} ${user.lastName}`).join(", ") }
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Task Description</p>
                      <p className="text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-500">
                        {task.assignTask || "No description provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remarks</p>
                      <p className="text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-500">
                        {task.remark || "No remarks"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "No deadline set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Attachments */}
              <div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Download size={20} />
                    Attachments
                    {task.attachments && task.attachments.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {task.attachments.length}
                      </span>
                    )}
                  </h3>

                  {task.attachments && task.attachments.length > 0 ? (
                    <div className="space-y-4">
                      {task.attachments.map((file, index) => (
                        <div key={index} className="group">
                          <a
                            href={`http://localhost:4000${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <div className="bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 p-4 hover:shadow-md transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                              <img
                                src={`http://localhost:4000${file}`}
                                alt={`attachment-${index}`}
                                className="w-full h-48 object-contain rounded-md mb-3 transition-transform group-hover:scale-105"
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
                                  {file.split("/").pop()}
                                </span>
                                <Download size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" />
                              </div>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText size={48} className="text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No attachments available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;