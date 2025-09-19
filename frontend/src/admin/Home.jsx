import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for redirect
import axios from "axios";
import { DollarSign, Share2, ThumbsUp, Star } from "lucide-react";
import ActiveIntern from "../components/homeComponents/ActiveIntern";
import PassoutIntern from "../components/homeComponents/PassoutIntern";
import InprogessIntern from "../components/homeComponents/InprogessIntern";

import TotalIntern from "../components/homeComponents/TotalIntern";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Total");
  const [records, setRecords] = useState([]); // interns
  const [tasks, setTasks] = useState([]); // tasks
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    const parsed = authData ? JSON.parse(authData) : null;
    const token = parsed?.token;

    if (!token) {
      navigate("/login"); // redirect if no token
      return;
    }

    // ✅ Fetch interns
    axios
      .get("http://localhost:4000/api/users", {
        headers: { auth: token },
      })
      .then((response) => {
        console.log("Intern records fetched:", response.data);
        setRecords(response.data);
      })
      .catch((error) => {
        console.error("Error fetching interns:", error);
        navigate("/login"); // if token invalid → go login
      });

    // ✅ Fetch tasks
    axios
      .get("http://localhost:4000/api/intern/tasks", {
        headers: { auth: token },
      })
      .then((response) => {
        console.log("Tasks fetched:", response.data);
        setTasks(response.data.tasks || []); // ensure array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        navigate("/login"); // if token invalid → go login
      });
  }, [navigate]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // ✅ Stats → based only on tasks
  const total = records.length;
  const active = tasks.filter((t) => t.statusbar === "new").length;
  const inprogress = tasks.filter((t) => t.statusbar === "inprogress").length;
  const completed = tasks.filter((t) => t.statusbar === "completed").length;

  const stats = [
    {
      key: "Total",
      label: "Total Intern",
      value: total,
      icon: <DollarSign className="w-5 h-5" />,
      bg: "bg-white text-white",
    },
    {
      key: "new",
      label: "New" ,
      value: active,
      icon: <Share2 className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
    {
      key: "inprogress",
      label: "Inprogress",
      value: inprogress,
      icon: <ThumbsUp className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
    {
      key: "completed",
      label: "Completed",
      value: completed,
      icon: <Star className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
  ];

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {stats.map((item) => (
          <div
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:scale-105 transition ${item.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2
                className={`text-sm font-medium ${
                  item.bg.includes("bg-blue-900") ? "text-white" : "text-gray-700"
                }`}
              >
                {item.label}
              </h2>
              {item.icon}
            </div>
            <p
              className={`text-2xl font-bold ${
                item.bg.includes("bg-blue-900") ? "text-white" : "text-gray-800"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Conditional rendering */}
      <div className="p-6">
        {activeTab === "Total" && <TotalIntern tasks={tasks} records={records} />}
        {activeTab === "new" && <ActiveIntern tasks={tasks} />}
        {activeTab === "inprogress" && <InprogessIntern tasks={tasks} />}
        {activeTab === "completed" && <PassoutIntern tasks={tasks} />}
      </div>
    </>
  );
};

export default Home;
