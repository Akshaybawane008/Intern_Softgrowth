import { useEffect, useState } from "react";
import { ClipboardList, Clock, CheckCircle, User, Sparkles, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import AssingedTask from "../internComponent/AssingedTask";
import DoneTask from "../internComponent/DoneTask";
import PendingTask from "../internComponent/PendingTask";
import axios from "axios";

const InternHome = () => {
  const [activeTab, setActiveTab] = useState("assigned"); 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assigned: 0,
    pending: 0,
    done: 0
  });

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    const parsed = authData ? JSON.parse(authData) : null;
    const token = parsed?.token;

    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/intern/assignedtasks`, {
        headers: { auth: token },
      })
      .then((res) => {
        setTasks(res.data.tasks || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, []);

  // Calculate stats with animation effect
  useEffect(() => {
    if (tasks.length > 0) {
      const assignedCount = tasks.filter((t) => t.statusbar === "new").length;
      const pendingCount = tasks.filter((t) => t.statusbar === "inprogress").length;
      const doneCount = tasks.filter((t) => t.statusbar === "completed").length;
      
      setStats({
        assigned: assignedCount,
        pending: pendingCount,
        done: doneCount
      });
    }
  }, [tasks]);

  // ✅ Enhanced loader with animation
  if (loading) {
    return (
      <div className="flex-1 w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <Sparkles className="w-6 h-6 text-blue-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-4">
          Loading Your Tasks...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Getting everything ready for you
        </p>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((stats.done / totalTasks) * 100) : 0;

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header Section */}
      <div className="p-6 pb-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and track your assigned tasks efficiently
            </p>
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 mt-4 lg:mt-0 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => setActiveTab("assigned")} 
            className="cursor-pointer transform transition-all duration-300 lg:hover:scale-105 hover:shadow-lg"
          >
            <StatCard
              label="New Tasks"
              value={stats.assigned}
              icon={<User className="w-6 h-6 text-blue-500" />}
              bgColor={
                activeTab === "assigned"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              }
              textColor={activeTab === "assigned" ? "text-white" : "text-gray-800 dark:text-white"}
              borderColor={activeTab === "assigned" ? "border-blue-500" : "border-gray-200 dark:border-gray-700"}
              showBadge={stats.assigned > 0}
              badgeColor="bg-blue-500"
            />
          </div>

          <div 
            onClick={() => setActiveTab("pending")} 
            className="cursor-pointer transform transition-all duration-300 lg:hover:scale-105 hover:shadow-lg"
          >
            <StatCard
              label="In Progress"
              value={stats.pending}
              icon={<Clock className="w-6 h-6 text-orange-500" />}
              bgColor={
                activeTab === "pending"
                  ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                  : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              }
              textColor={activeTab === "pending" ? "text-white" : "text-gray-800 dark:text-white"}
              borderColor={activeTab === "pending" ? "border-orange-500" : "border-gray-200 dark:border-gray-700"}
              showBadge={stats.pending > 0}
              badgeColor="bg-orange-500"
            />
          </div>

          <div 
            onClick={() => setActiveTab("done")} 
            className="cursor-pointer transform transition-all duration-300 lg:hover:scale-105 hover:shadow-lg"
          >
            <StatCard
              label="Completed"
              value={stats.done}
              icon={<CheckCircle className="w-6 h-6 text-green-500" />}
              bgColor={
                activeTab === "done"
                  ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                  : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              }
              textColor={activeTab === "done" ? "text-white" : "text-gray-800 dark:text-white"}
              borderColor={activeTab === "done" ? "border-green-500" : "border-gray-200 dark:border-gray-700"}
              showBadge={stats.done > 0}
              badgeColor="bg-green-500"
            />
          </div>
        </div>

        {/* Task Summary Bar */}
        
      </div>

      {/* Task List Container */}
      <div className="px-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {activeTab === "assigned" && <AssingedTask tasks={tasks} />}
          {activeTab === "pending" && (
            <PendingTask tasks={tasks.filter((t) => t.statusbar === "inprogress")} />
          )}
          {activeTab === "done" && (
            <DoneTask tasks={tasks.filter((t) => t.statusbar === "completed")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InternHome;