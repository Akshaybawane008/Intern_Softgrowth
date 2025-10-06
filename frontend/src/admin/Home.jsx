import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react";

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const total = records.length;
  const active = tasks.filter((t) => t.statusbar === "new").length;
  const inprogress = tasks.filter((t) => t.statusbar === "inprogress").length;
  const completed = tasks.filter((t) => t.statusbar === "completed").length;

  const stats = [
    {
      key: "Total",
    
      value: total,
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      key: "new",
    
      value: active,
      icon: <Clock className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      key: "inprogress",
   
      value: inprogress,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      key: "completed",
    
      value: completed,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
  ];

  return (
    <>
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl -z-10"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {stats.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
                activeTab === item.key 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-xl transform scale-105` 
                  : `bg-white dark:bg-gray-800 shadow-lg ${item.bgColor}`
              }`}
            >
              {/* Background Pattern */}
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${
                activeTab === item.key ? 'bg-white/10' : `${item.bgColor}`
              } transform translate-x-8 -translate-y-8`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    activeTab === item.key 
                      ? 'bg-white/20' 
                      : `${item.bgColor} ${item.textColor}`
                  }`}>
                    {item.icon}
                  </div>
                  {activeTab === item.key && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
                
             
                
                <p className={`text-3xl font-bold ${
                  activeTab === item.key ? 'text-white' : 'text-gray-800 dark:text-gray-100'
                }`}>
                  {item.value}
                </p>

                {/* Progress Bar for Active Tab */}
                {activeTab === item.key && (
                  <div className="w-full bg-white/20 rounded-full h-1.5 mt-4">
                    <div 
                      className="bg-white rounded-full h-1.5 transition-all duration-1000"
                      style={{ 
                        width: `${(item.value / Math.max(total, 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl border-2 ${
                activeTab === item.key 
                  ? 'border-white/30' 
                  : `border-transparent group-hover:border-${item.color.split('-')[1]}-500/30`
              } transition-all duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="p-6 pt-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "Total" && <TotalIntern tasks={tasks} records={records} />}
              {activeTab === "new" && <ActiveIntern tasks={tasks} />}
              {activeTab === "inprogress" && <InprogessIntern tasks={tasks} />}
              {activeTab === "completed" && <PassoutIntern tasks={tasks} />}
            </div>
          </div>
        </div>
   
    </>
  );
};

export default Home;