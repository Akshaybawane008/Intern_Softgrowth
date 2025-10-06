const StatCard = ({ label, value, icon, bgColor, textColor }) => {
  return (
    <div
      className={`relative rounded-2xl shadow-lg p-6 flex flex-col justify-between items-start w-full h-40 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-white/20 ${bgColor} overflow-hidden group`}
    >
      {/* Background Icon */}
      <div className="absolute top-2 right-2 w-16 h-16 opacity-5">
        {icon}
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between w-full z-10">
        <h2 className={`text-sm font-semibold ${textColor} tracking-wide uppercase`}>{label}</h2>
        <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg transition-transform group-hover:scale-110">
          {icon}
        </div>
      </div>
      
      {/* Main Value */}
      <div className="z-10 w-full">
        <p className={`text-3xl font-bold ${textColor} mb-1`}>{value}</p>
        
        {/* Subtle Divider */}
        <div className="w-12 h-1 bg-current opacity-30 rounded-full"></div>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};

export default StatCard;