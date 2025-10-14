import { useState, useEffect } from "react";
import {
  Home,
  LogOut,
  UserPlus,
  Menu,
  TextSearch,
  BookOpenCheck,
  FileText,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Building,
} from "lucide-react";
import { Link, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Registrationform from "../components/Registrationform";
import Task from "../components/Task";
import HomeP from "../admin/Home";
import Records from "../components/Records";
import TaskRecord from "../admin/TaskRecord";
import TaskDetails from "../pages/intern/TaskDetails";
import UpdateRegistraion from "../admin/UpdateRegistration";
import UpdateTask from "../components/UpdateTask";

const HomePage = () => (
  <h1 className="text-2xl">
    <HomeP />
  </h1>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark" || true
  );
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", icon: <Home size={22} />, link: "/admin/home" },
    { name: "Assign Task", icon: <BookOpenCheck size={22} />, link: "/admin/task" },
    { name: "Task Records", icon: <FileText size={22} />, link: "/admin/taskrecords" },
    { name: "Registration", icon: <UserPlus size={22} />, link: "/admin/registration" },
    { name: "Intern Records", icon: <TextSearch size={22} />, link: "/admin/records" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-72" : "w-22"
        } fixed top-0 left-0 h-screen bg-gradient-to-b from-white to-gray-100 dark:from-slate-800 dark:to-gray-900 text-gray-800 dark:text-white transition-all duration-500 ease-in-out p-4 flex flex-col justify-between shadow-2xl z-50 border-r border-gray-200 dark:border-gray-700`}
      >
        {/* Top Section */}
        <div>
        {/* Logo Section */}
<div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"} mb-8`}>
  {isOpen ? (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 sm:w-10 md:w-12 lg:w-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <Building 
          size={24} 
          className="sm:text-[28px] md:text-[32px] lg:text-[36px] text-white" 
        />
      </div>
      <div>
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
          Softgrowth
        </h2>
        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
          Admin Panel
        </p>
      </div>
    </div>
  ) : (
    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
      <Building size={18} className="text-white" />
    </div>
  )}

  <button
    onClick={() => setIsOpen(!isOpen)}
    className={` ${isOpen ? "p-2" : "p-[1px]"}  ml-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-600 dark:text-gray-300`}
  >
    {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={15} />}
  </button>
</div>


          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                onClick={() => setActiveItem(item.name)}
                className={`flex items-center ${
                  isOpen ? "justify-start gap-4 p-3" : "justify-center p-3"
                } rounded-xl transition-all duration-300 group ${
                  activeItem === item.name
                    ? "bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/25"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                } ${isOpen ? "" : "mx-auto"}`}
              >
                <div
                  className={`transition-all duration-300 ${
                    activeItem === item.name
                      ? "text-blue-600 dark:text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </div>
                {isOpen && (
                  <span
                    className={`font-medium transition-all duration-300 ${
                      activeItem === item.name
                        ? "text-blue-700 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for closed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-gray-200 dark:border-gray-700">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center ${
              isOpen ? "justify-start gap-4 p-3" : "justify-center p-3"
            } w-full rounded-xl transition-all duration-300 group ${
              darkMode 
                ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/20" 
                : "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/20"
            }`}
          >
            <div className={`p-1.5 rounded-lg bg-white dark:bg-gray-700 group-hover:bg-gray-50 dark:group-hover:bg-gray-600 transition-colors ${isOpen ? "" : "mx-auto"} shadow-sm`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            {isOpen && (
              <span className="font-medium">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
            
            {/* Tooltip for closed state */}
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-gray-200 dark:border-gray-700">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </div>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isOpen ? "justify-start gap-4 p-3" : "justify-center p-3"
            } w-full rounded-xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all duration-300 group`}
          >
            <div className={`p-1.5 rounded-lg bg-white dark:bg-gray-700 group-hover:bg-gray-50 dark:group-hover:bg-gray-600 transition-colors ${isOpen ? "" : "mx-auto"} shadow-sm`}>
              <LogOut size={18} />
            </div>
            {isOpen && <span className="font-medium">Logout</span>}
            
            {/* Tooltip for closed state */}
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-gray-200 dark:border-gray-700">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 min-h-screen transition-all duration-500 ease-in-out ${
          isOpen ? "ml-72" : "ml-20"
        }`}
      >
        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-0 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl -z-10"></div>
        
        {/* Content Container */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="registration" element={<Registrationform />} />
            <Route path="taskrecords" element={<TaskRecord />} />
            <Route path="records" element={<Records />} />
            <Route path="task" element={<Task />} />
            <Route path="task/:id" element={<TaskDetails />} />
            <Route path="/update/:id" element={<UpdateRegistraion />} />
            <Route path="/update/task/:id" element={<UpdateTask />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;