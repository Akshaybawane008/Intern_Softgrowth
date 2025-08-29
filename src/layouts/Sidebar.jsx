import { useState } from "react";
import { Home, User, Settings, LogOut, UserPlus } from "lucide-react";
import { Link, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Registrationform from "../components/Registrationform";

// Example extra pages
const HomePage = () => <h1 className="p-6 text-2xl">🏠 Home Page</h1>;
const ProfilePage = () => <h1 className="p-6 text-2xl">👤 Profile Page</h1>;
const SettingsPage = () => <h1 className="p-6 text-2xl">⚙️ Settings Page</h1>;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth"); // clear auth
    navigate("/login"); // redirect to login
  };

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, link: "/admin/home" },
    { name: "Profile", icon: <User size={20} />, link: "/admin/profile" },
    { name: "Registration", icon: <UserPlus size={20} />, link: "/admin/registration" },
    { name: "Settings", icon: <Settings size={20} />, link: "/admin/settings" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-60" : "w-20"
        } h-screen bg-gray-900 text-white transition-all duration-300 p-4 flex flex-col justify-between`}
      >
        {/* Top Section */}
        <div>
          {/* Toggle Button */}
          <button
            className="text-white mb-6"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "<<" : ">>"}
          </button>

          {/* Sidebar Heading */}
          {isOpen && (
            <h2 className="text-xl font-bold mb-6 text-center">
              Admin Dashboard
            </h2>
          )}

          {/* Menu Items */}
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
                >
                  {item.icon}
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Section - Logout */}
        <div>
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
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Routes>
          {/* Default redirect: /admin → /admin/home */}
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="registration" element={<Registrationform />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Sidebar;
