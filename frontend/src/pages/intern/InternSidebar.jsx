import { useEffect, useState } from "react";
import { Home, History, LogOut, Menu } from "lucide-react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import IntenRecord from "./InternRecord";
import InterHome from "./InterHome"; // ✅ import your home component

const InternSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

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

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-60" : "w-20"
        } bg-gray-900 text-white h-screen flex flex-col justify-between transition-all duration-300 fixed md:relative`}
      >
        <div>
          {/* Toggle Button */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="text-lg font-bold">Intern Panel</span>
            <button onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}+${user?.lastName}`}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            {isOpen && (
              <div>
                <h2 className="font-semibold text-sm">
                  {user ? `${user.name} ${user.lastName}` : "Loading..."}
                </h2>
                <p className="text-xs text-gray-400">
                  {user ? user.role : "Fetching..."}
                </p>
              </div>
            )}
          </div>

          {/* Menu */}
          <ul className="space-y-2 p-4">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => navigate(item.link)}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
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
      <div className="flex-1 ml-20 md:ml-0 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="home" element={<InterHome />} />
          <Route path="history" element={<IntenRecord />} />
          {/* add history page if needed */}
        </Routes>
      </div>
    </div>
  );
};

export default InternSidebar;
