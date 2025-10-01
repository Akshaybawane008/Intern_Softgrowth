import { useEffect, useState } from "react";
import { ClipboardList, Clock, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";
import AssingedTask from "../internComponent/AssingedTask";
import DoneTask from "../internComponent/DoneTask";
import PendingTask from "../internComponent/PendingTask";
import axios from "axios";

const Home = () => {
  const [activeTab, setActiveTab] = useState("assigned"); 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    const parsed = authData ? JSON.parse(authData) : null;
    const token = parsed?.token;

    if (!token) return;

    axios
      .get("http://localhost:4000/api/intern/assignedtasks", {
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

  // ✅ Full width + height loader
  if (loading) {
    return (
      <div className="flex-1 w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Loading...
        </p>
      </div>
    );
  }

  const assignedCount = tasks.filter((t) => t.statusbar === "new").length;
  const pendingCount = tasks.filter((t) => t.statusbar === "inprogress").length;
  const doneCount = tasks.filter((t) => t.statusbar === "completed").length;

  return (
    <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 p-6">
        <div onClick={() => setActiveTab("assigned")} className="cursor-pointer">
          <StatCard
            label="New Task"
            value={assignedCount}
            
            icon={<User className="w-8 h-8 text-blue-500" />}
            bgColor={
              activeTab === "assigned"
                ? "bg-blue-100 dark:bg-blue-800"
                : "bg-white dark:bg-gray-800"
            }
            textColor="text-gray-800 dark:text-white"
          />
        </div>

        <div onClick={() => setActiveTab("pending")} className="cursor-pointer">
          <StatCard
            label="Pending Task"
            value={pendingCount}
            icon={<Clock className="w-8 h-8 text-orange-500" />}
            bgColor={
              activeTab === "pending"
                ? "bg-orange-100 dark:bg-orange-800"
                : "bg-white dark:bg-gray-800"
            }
            textColor="text-gray-800 dark:text-white"
          />
        </div>

        <div onClick={() => setActiveTab("done")} className="cursor-pointer">
          <StatCard
            label="Done Task"
            value={doneCount}
            icon={<CheckCircle className="w-8 h-8 text-green-500" />}
            bgColor={
              activeTab === "done"
                ? "bg-green-100 dark:bg-green-800"
                : "bg-white dark:bg-gray-800"
            }
            textColor="text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Task List */}
      <div >
        {activeTab === "assigned" && <AssingedTask tasks={tasks} />}
        {activeTab === "pending" && (
          <PendingTask tasks={tasks.filter((t) => t.statusbar === "inprogress")} />
        )}
        {activeTab === "done" && (
          <DoneTask tasks={tasks.filter((t) => t.statusbar === "completed")} />
        )}
      </div>
    </div>
  );
};

export default Home;
