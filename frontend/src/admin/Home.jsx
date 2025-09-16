import { useState } from "react";
import { DollarSign, Share2, ThumbsUp, Star } from "lucide-react";
// import TotalIntern from "../components/homeComponents/TotalIntern";
import ActiveIntern from "../components/homeComponents/ActiveIntern";
import PassoutIntern from "../components/homeComponents/PassoutIntern";
import InprogessIntern from "../components/homeComponents/InprogessIntern";
import Records from "../components/Records"

const Home = () => {
  const [activeTab, setActiveTab] = useState("Total"); // <-- state for active tab

  const stats = [
    {
      key: "Total",
      label: "Total Intern",
      value: "628",
      icon: <DollarSign className="w-5 h-5" />,
      bg: "bg-blue-900 text-white",
    },
    {
      key: "Active",
      label: "Active Intern",
      value: "2434",
      icon: <Share2 className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
    {
      key: "Passout",
      label: "Passout Intern",
      value: "1259",
      icon: <ThumbsUp className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
    {
      key: "Rating",
      label: "Average Rating",
      value: "8.5",
      icon: <Star className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
  ];

  return (
    <>
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {stats.map((item) => (
          <div
            key={item.key}
            onClick={() => setActiveTab(item.key)} // set tab dynamically
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
        {activeTab === "Total" && <Records />}
        {activeTab === "Active" && <ActiveIntern />}
        {activeTab === "Passout" && <PassoutIntern />}
        {activeTab === "Rating" && <InprogessIntern />}
      </div>
    </>
  );
};

export default Home;
