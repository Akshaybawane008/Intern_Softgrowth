import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { User, Layers, NotepadText, CheckCheck } from "lucide-react";

import ActiveIntern from "../components/homeComponents/ActiveIntern";
import PassoutIntern from "../components/homeComponents/PassoutIntern";
import InprogessIntern from "../components/homeComponents/InprogessIntern";
import TotalIntern from "../components/homeComponents/TotalIntern";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Total");
  const [records, setRecords] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
      .get("http://localhost:4000/api/users", {
        headers: { auth: token },
      })
      .then((response) => setRecords(response.data))
      .catch(() => navigate("/login"));

    axios
      .get("http://localhost:4000/api/intern/tasks", {
        headers: { auth: token },
      })
      .then((response) => {
        setTasks(response.data.tasks || []);
        setLoading(false);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (loading) {
    return <p className="p-6 dark:text-gray-200">Loading...</p>;
  }

  const total = records.length;
  const active = tasks.filter((t) => t.statusbar === "new").length;
  const inprogress = tasks.filter((t) => t.statusbar === "inprogress").length;
  const completed = tasks.filter((t) => t.statusbar === "completed").length;

  const stats = [
    {
      key: "Total",
      label: "Total Intern",
      value: total,
      icon: <User className="w-10  h-10 text-gray-600 dark:text-gray-300" />,
    },
    {
      key: "new",
      label: "New",
      value: active,
      icon: <Layers className="w-10 h-10 text-blue-500 dark:text-blue-400" />,
    },
    {
      key: "inprogress",
      label: "Inprogress",
      value: inprogress,
      icon: <NotepadText className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />,
    },
    {
      key: "completed",
      label: "Completed",
      value: completed,
      icon: <CheckCheck className="w-10 h-10 text-green-500 dark:text-green-400" />,
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {stats.map((item) => (
          <div
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className="rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:scale-105 transition bg-white dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {item.label}
              </h2>
              {item.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Conditional rendering */}
      <div className="px-6 text-gray-900 dark:text-gray-100">
        {activeTab === "Total" && <TotalIntern tasks={tasks} records={records} />}
        {activeTab === "new" && <ActiveIntern tasks={tasks} />}
        {activeTab === "inprogress" && <InprogessIntern tasks={tasks} />}
        {activeTab === "completed" && <PassoutIntern tasks={tasks} />}
      </div>
    </div>
  );
};

export default Home;
