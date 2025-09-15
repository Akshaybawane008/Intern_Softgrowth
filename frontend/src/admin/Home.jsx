import { DollarSign, Share2, ThumbsUp, Star } from "lucide-react";

const Home = () => {
  const stats = [
    {
      label: "Total Intern",
      value: " 628",
      icon: <DollarSign className="w-5 h-5" />,
      bg: "bg-blue-900 text-white",
    },
    {
      label: "Active Intern",
      value: "2434",
      icon: <Share2 className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
    {
      label: "Passout Intern",
      value: "1259",
      icon: <ThumbsUp className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
    {
      label: "",
      value: "8.5",
      icon: <Star className="w-5 h-5 text-orange-500" />,
      bg: "bg-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className={`rounded-xl shadow-md p-4 flex flex-col justify-between ${item.bg}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2
              className={`text-sm font-medium ${
                item.bg === "bg-blue-900 text-white" ? "text-white" : "text-gray-700"
              }`}
            >
              {item.label}
            </h2>
            {item.icon}
          </div>
          <p
            className={`text-2xl font-bold ${
              item.bg === "bg-blue-900 text-white" ? "text-white" : "text-gray-800"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Home;
