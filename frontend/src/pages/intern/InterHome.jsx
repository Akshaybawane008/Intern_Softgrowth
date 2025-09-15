import { useState } from "react";
import { ClipboardList, Clock, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";
import AssingedTask from "../internComponent/AssingedTask";
import DoneTask from "../internComponent/DoneTask";
import PendingTask from "../internComponent/PendingTask";

const Home = () => {
  const [activeTab, setActiveTab] = useState("assigned"); // default: Assigned

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 p-6">
        <div onClick={() => setActiveTab("assigned")} className="cursor-pointer">
          <StatCard
            label="Assigned Task"
            value="10"
            icon={<ClipboardList className="w-8 h-8 text-blue-500" />}
            bgColor={activeTab === "assigned" ? "bg-blue-100" : "bg-white"}
            textColor="text-gray-800"
          />
        </div>

        <div onClick={() => setActiveTab("pending")} className="cursor-pointer">
          <StatCard
            label="Pending Task"
            value="4"
            icon={<Clock className="w-8 h-8 text-orange-500" />}
            bgColor={activeTab === "pending" ? "bg-orange-100" : "bg-white"}
            textColor="text-gray-800"
          />
        </div>

        <div onClick={() => setActiveTab("done")} className="cursor-pointer">
          <StatCard
            label="Done Task"
            value="6"
            icon={<CheckCircle className="w-8 h-8 text-green-500" />}
            bgColor={activeTab === "done" ? "bg-green-100" : "bg-white"}
            textColor="text-gray-800"
          />
        </div>
      </div>

      {/* Render only active component */}
      <div className="p-6">
        {activeTab === "assigned" && <AssingedTask />}
        {activeTab === "pending" && <PendingTask />}
        {activeTab === "done" && <DoneTask />}
      </div>
    </>
  );
};

export default Home;
