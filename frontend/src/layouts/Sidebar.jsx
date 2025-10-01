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
    () => localStorage.getItem("theme") === "dark" || true // default dark
  );
  const navigate = useNavigate();

  // Apply dark mode class when state changes
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
    { name: "Home", icon: <Home size={20} />, link: "/admin/home" },
    { name: "Assign Task", icon: <BookOpenCheck size={20} />, link: "/admin/task" },
    { name: "Task Records", icon: <FileText size={20} />, link: "/admin/taskrecords" },
    { name: "Registration", icon: <UserPlus size={20} />, link: "/admin/registration" },
    { name: "Intern Records", icon: <TextSearch size={20} />, link: "/admin/records" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-60" : "w-20"
        } fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 text-black dark:text-white transition-all duration-300 p-4 flex flex-col justify-between`}
      >
        {/* Top Section */}
        <div>
          <div
            className={`flex items-center mb-4 ${
              isOpen ? "justify-between" : "justify-center"
            }`}
          >
            {isOpen && <h2 className="text-xl font-bold">Softgrowth</h2>}
            <button
              className="text-black dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg"
                >
                  {item.icon}
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          {/* Dark/Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg w-full"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isOpen && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 cursor-pointer hover:bg-red-600 p-2 rounded-lg w-full"
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white min-h-screen transition-all duration-300 ${
          isOpen ? "ml-60" : "ml-20"
        }`}
      >
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
  );
};

export default Sidebar;
