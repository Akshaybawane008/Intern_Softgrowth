import { useState } from "react";
import { Home, User, Settings, LogOut, UserPlus, Menu , X, TextSearch, BookOpenCheck } from "lucide-react";
import { Link, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Registrationform from "../components/Registrationform";
import Task from "../components/Task";
import HomeP from '../admin/Home'
import Profile from "../admin/Profile"
import Records from "../components/Records";

// Example extra pages
const HomePage = () => <h1 className="text-2xl"><HomeP/></h1>;
const ProfilePage = () => <h1 className="p-6 text-2xl"><Profile/></h1>;
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
    { name: "Records", icon: <TextSearch size={20}/>, link: "/admin/records" },
    { name: "task", icon: <BookOpenCheck size={20} />, link: "/admin/task" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-60" : "w-20"
        } h-screen bg-gray-50 text-black transition-all duration-300 p-4 flex flex-col justify-between`}
      >
        {/* Top Section */}
        <div>
          <div className="flex">
          
          {/* Sidebar Heading */}
          {isOpen && (
            <h2 className="text-xl font-bold mb-6 text-center">
             Softgrowth
            </h2>
          )}
            {/* Toggle Button */}
          <button
            className="text-black mb-6 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Menu /> : <X />}
          </button>

          </div>

          {/* Menu Items */}
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li className="" key={index}>
                <Link
                  to={item.link}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
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
          <Route path="records" element={<Records />} />
          <Route path="task" element={<Task/>} />
        </Routes>
      </div>
    </div>
  );
};

export default Sidebar;
