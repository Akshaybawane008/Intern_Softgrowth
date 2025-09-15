const StatCard = ({ label, value, icon, bgColor, textColor }) => {
  return (
    <div
      className={`rounded-xl shadow-lg p-8 flex flex-col justify-between items-start w-full h-48 ${bgColor}`}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className={`text-lg font-semibold ${textColor}`}>{label}</h2>
        <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      </div>
      <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
};

export default StatCard;
