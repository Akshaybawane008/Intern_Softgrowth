import { ClipboardList, Clock, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";

const Home = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 p-6 ">
      <StatCard
        label="Assigned Task"
        value="10"
        icon={<ClipboardList className="w-8 h-8 text-blue-500" />}
        bgColor="bg-white"
        textColor="text-gray-800"
      />

      <StatCard
        label="Pending Task"
        value="4"
        icon={<Clock className="w-8 h-8 text-orange-500" />}
        bgColor="bg-white"
        textColor="text-gray-800"
      />

      <StatCard
        label="Done Task"
        value="6"
        icon={<CheckCircle className="w-8 h-8 text-green-500" />}
        bgColor="bg-white"
        textColor="text-gray-800"
      />
    </div>
  );
};

export default Home;
