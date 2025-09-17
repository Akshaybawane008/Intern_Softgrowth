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

  if (loading) return <p className="p-6">Loading...</p>;

  // ✅ Count tasks by status
  const assignedCount = tasks.filter((t) => t.statusbar === "new").length;
  const pendingCount = tasks.filter((t) => t.statusbar === "inprogress").length;
  const doneCount = tasks.filter((t) => t.statusbar === "completed").length;

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 p-6">
        <div onClick={() => setActiveTab("assigned")} className="cursor-pointer">
          <StatCard
            label="New Task"
            value={assignedCount}
            icon={<ClipboardList className="w-8 h-8 text-blue-500" />}
            bgColor={activeTab === "assigned" ? "bg-blue-100" : "bg-white"}
            textColor="text-gray-800"
          />
        </div>

        <div onClick={() => setActiveTab("pending")} className="cursor-pointer">
          <StatCard
            label="Pending Task"
            value={pendingCount}
            icon={<Clock className="w-8 h-8 text-orange-500" />}
            bgColor={activeTab === "pending" ? "bg-orange-100" : "bg-white"}
            textColor="text-gray-800"
          />
        </div>

        <div onClick={() => setActiveTab("done")} className="cursor-pointer">
          <StatCard
            label="Done Task"
            value={doneCount}
            icon={<CheckCircle className="w-8 h-8 text-green-500" />}
            bgColor={activeTab === "done" ? "bg-green-100" : "bg-white"}
            textColor="text-gray-800"
          />
        </div>
      </div>

      {/* Render only active component and pass tasks */}
      <div className="p-6">
        {activeTab === "assigned" && <AssingedTask tasks={tasks} />}
        {activeTab === "pending" && (
          <PendingTask tasks={tasks.filter((t) => t.statusbar === "inprogress")} />
        )}
        {activeTab === "done" && (
          <DoneTask tasks={tasks.filter((t) => t.statusbar === "completed")} />
        )}
      </div>
    </>
  );
};

export default Home;
