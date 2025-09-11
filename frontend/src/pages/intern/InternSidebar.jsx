import { useState } from "react";
import { Home, ListTodo, History, LogOut, Menu } from "lucide-react";
import { Navigate, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import DashboradIntern from "../../components/Intern/DashboradIntern";
import HistoryIntern from "../../components/Intern/HistoryIntern";
import TaskIntern from "../../components/Intern/TaskIntern";

const InternSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("auth"); // clear login data
    navigate("/login"); // redirect to login page
  };

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, link: "/intern/home" },
    { name: "Task", icon: <ListTodo size={20} />, link: "/intern/task" },
    { name: "History", icon: <History size={20} />, link: "/intern/history" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-60" : "w-20"
        } bg-gray-900 text-white h-screen flex flex-col justify-between transition-all duration-300 fixed md:relative`}
      >
        <div>
          {/* Toggle Button (only on mobile) */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="text-lg font-bold">Intern Panel</span>
            <button onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            {isOpen && (
              <div>
                <h2 className="font-semibold text-sm">Akshay</h2>
                <p className="text-xs text-gray-400">Intern</p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 p-4">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.link;
              return (
                <li
                  key={index}
                  onClick={() => navigate(item.link)}
                  className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  {isOpen && <span>{item.name}</span>}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom (Logout) */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left hover:bg-gray-700 p-2 rounded-lg"
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="">
        <Routes>
          {/* Default redirect: /intern → /intern/home */}
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="home" element={<DashboradIntern />} />
          <Route path="task" element={<TaskIntern />} />
          <Route path="history" element={<HistoryIntern />} />
        </Routes>
      </div>
    </div>
  );
};

export default InternSidebar;
