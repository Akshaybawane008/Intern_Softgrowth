import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, Edit, ChevronLeft, ChevronRight, Users, Filter } from "lucide-react";

const TotalIntern = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // ✅ Auth token
  const authData = localStorage.getItem("auth");
  const parsed = authData ? JSON.parse(authData) : null;
  const token = parsed?.token;

  // Fetch data from backend API
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users", {
          headers: { auth: token },
        });
        const data = await response.json();
        console.log("userData = ", data);
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, [token]);

  // ✅ Delete handler
  const handleDelete = async (rec) => {
    if (!window.confirm(`Are you sure you want to delete ${rec.name} ${rec.lastName}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/users/${rec._id}`, {
        headers: { auth: token },
        method: "DELETE",
      });

      if (response.ok) {
        alert(`Details of ${rec.name} ${rec.lastName} deleted successfully`);
        setRecords((prev) => prev.filter((r) => r._id !== rec._id));
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    }
  };

  // Search code
  const filteredRecords = records
    .filter((rec) => {
      const fullName = `${rec.name || ""} ${rec.middleName || ""} ${rec.lastName || ""}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        rec.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.mobile?.toString().includes(searchTerm)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="p-3">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
            Intern Records
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Manage and view all intern information in one place
        </p>
      </div>

      {/* Controls Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                       placeholder-gray-500 dark:placeholder-gray-400 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Records per page */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Filter className="text-gray-400 w-4 h-4" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Rows:
            </label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Mobile Cards */}
        <div className="block lg:hidden">
          {currentRecords.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No records found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-3">
              {currentRecords.map((rec, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {rec.name} {rec.middleName} {rec.lastName}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{rec.email}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigate(`/admin/update/${rec._id}`)}
                        className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(rec)}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Mobile:</span>
                      <p className="text-gray-900 dark:text-white">{rec.mobile}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">College:</span>
                      <p className="text-gray-900 dark:text-white truncate">{rec.college}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(rec.durationStart).toLocaleDateString()} - {new Date(rec.durationEnd).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Aadhar:</span>
                      <p className="text-gray-900 dark:text-white font-mono">{rec.aadhar}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          {currentRecords.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No records found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <table className="w-full min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Mobile
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Email
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    College
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Duration
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Aadhar
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-gray-700 dark:text-gray-300 text-sm text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((rec, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm">
                      <div>
                        <div className="font-medium">{rec.name} {rec.middleName} {rec.lastName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(rec.dob).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm">
                      {rec.mobile}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm">
                      {rec.email}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm max-w-xs truncate">
                      {rec.college}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-xs">
                      {new Date(rec.durationStart).toLocaleDateString()} →{" "}
                      {new Date(rec.durationEnd).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white text-sm font-mono">
                      {rec.aadhar}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/update/${rec._id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 
                                   text-white rounded transition-colors text-xs"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rec)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 
                                   text-white rounded transition-colors text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 dark:border-gray-600 p-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of{" "}
                {filteredRecords.length} entries
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 border rounded text-xs font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalIntern;