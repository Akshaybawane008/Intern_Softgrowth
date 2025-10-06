import { useEffect, useState } from "react";
import {
  Home,
  History,
  LogOut,
  Moon,
  Sun,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useNavigate,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import InternRecord from "./InternRecord";
import InternHome from "./InternHome";
import TaskDetails from "./TaskDetails";

const InternSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark" || true
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  // Apply theme & persist to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch user profile
  useEffect(() => {
    const authData = localStorage.getItem("auth");
    const parsed = authData ? JSON.parse(authData) : null;
    const token = parsed?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:4000/api/users/profile/me", {
        headers: { auth: token },
      })
      .then((response) => {
        console.log("User profile fetched successfully:", response.data);
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      });
  }, [navigate]);

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, link: "/intern/home" },
    { name: "History", icon: <History size={20} />, link: "/intern/history" },
  ];

  const isActive = (link) => location.pathname === link;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`
          ${isOpen ? "w-64" : "w-20"}
          fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
          flex flex-col justify-between transition-all duration-300 z-50
          shadow-lg
        `}
      >
        <div>
          {/* Profile Section with Centered Toggle */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.name}+${user?.lastName}&background=3B82F6&color=ffffff&bold=true&size=128`}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 dark:text-white truncate text-sm bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
                      {user ? `${user.name} ${user.lastName}` : "Loading..."}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full inline-block">
                      {user ? user.role : "Fetching..."}
                    </p>
                  </div>
                )}
              </div>

              {/* Toggle Button - Always Visible */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              >
                {isOpen ? (
                  <ChevronLeft
                    size={16}
                    className="text-gray-600 dark:text-gray-400"
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    className="text-gray-600 dark:text-gray-400"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(item.link)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                      ${
                        isActive(item.link)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <div
                      className={`
                      p-1.5 rounded-md transition-colors flex-shrink-0
                      ${
                        isActive(item.link)
                          ? "bg-blue-100 dark:bg-blue-800"
                          : "bg-gray-100 dark:bg-gray-700"
                      }
                    `}
                    >
                      {item.icon}
                    </div>
                    {isOpen && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
              text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
            `}
          >
            <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </div>
            {isOpen && (
              <span className="font-medium text-sm">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
              text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
            `}
          >
            <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30 flex-shrink-0">
              <LogOut size={16} />
            </div>
            {isOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`
        flex-1 min-h-screen transition-all duration-300
        ${isOpen ? "ml-64" : "ml-20"}
      `}
      >
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="home" element={<InternHome />} />
          <Route path="history" element={<InternRecord />} />
          <Route path="task/:id" element={<TaskDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default InternSidebar;
