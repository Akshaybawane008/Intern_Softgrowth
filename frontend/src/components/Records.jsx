import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FilterList,
  Edit,
  Delete,
  Person,
  Email,
  Phone,
  School,
  CalendarToday,
  Assignment,
  Home,
  Badge,
  Refresh
} from "@mui/icons-material";

const Records = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/users");
      const data = await response.json();
      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (rec) => {
    if (!window.confirm(`Are you sure you want to delete ${rec.name} ${rec.lastName}?`)) return;

    try {
      const response = await fetch(`http://localhost:4000/api/users/${rec._id}`, { method: "DELETE" });
      if (response.ok) {
        setRecords((prev) => prev.filter((r) => r._id !== rec._id));
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    }
  };

  // Filter records for global search across all columns
  const filteredRecords = records
    .filter((rec) => {
      const term = searchTerm.toLowerCase();

      const fullName = `${rec.name || ""} ${rec.middleName || ""} ${rec.lastName || ""}`.toLowerCase();
      const mobile = (rec.mobile || "").toString();
      const email = (rec.email || "").toLowerCase();
      const dob = rec.dob ? new Date(rec.dob).toLocaleDateString().toLowerCase() : "";
      const college = (rec.college || "").toLowerCase();
      const duration = rec.durationStart && rec.durationEnd
        ? `${new Date(rec.durationStart).toLocaleDateString()} → ${new Date(rec.durationEnd).toLocaleDateString()}`.toLowerCase()
        : "";
      const aadhar = (rec.aadhar || "").toString().toLowerCase();
      const address = (rec.address || "").toLowerCase();

      return (
        fullName.includes(term) ||
        mobile.includes(term) ||
        email.includes(term) ||
        dob.includes(term) ||
        college.includes(term) ||
        duration.includes(term) ||
        aadhar.includes(term) ||
        address.includes(term)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content Container */}
      <div className="w-full px-4 py-6">
        <div className="max-w-full mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="w-full lg:w-auto">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Intern Records
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and view all intern information
              </p>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0 w-full lg:w-auto">
              <button
                onClick={fetchRecords}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 w-full lg:w-auto justify-center"
              >
                <Refresh className="text-lg" />
                Refresh
              </button>
            </div>
          </div>

    
         

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by name, email, college, mobile, aadhar..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>

              {/* Records per page and pagination info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Show:</label>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="border border-gray-300 dark:border-gray-600 p-2 text-sm rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[5, 10, 15, 20, 25].map((n) => <option key={n} value={n}>{n} records</option>)}
                  </select>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length}
                </div>
              </div>
            </div>
          </div>

          {/* Records Table Container */}
          <div className="w-full overflow-hidden hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-1/4">
                        Intern Information
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-1/5">
                        Contact Details
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-1/4">
                        Education & Duration
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        Identification
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-1/6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentRecords.length > 0 ? (
                      currentRecords.map((rec, index) => (
                        <tr 
                          key={rec._id} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        >
                          {/* Personal Information */}
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Person className="text-white text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                                  {rec.name} {rec.middleName} {rec.lastName}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  <CalendarToday className="text-xs" />
                                  {rec.dob ? new Date(rec.dob).toLocaleDateString() : "No DOB"}
                                </div>
                                {rec.address && (
                                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Home className="text-xs mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2 break-words">{rec.address}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Contact Details */}
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              {rec.email && (
                                <div className="flex items-center gap-2">
                                  <Email className="text-gray-400 text-xs flex-shrink-0" />
                                  <span className="text-xs text-gray-900 dark:text-white truncate">{rec.email}</span>
                                </div>
                              )}
                              {rec.mobile && (
                                <div className="flex items-center gap-2">
                                  <Phone className="text-gray-400 text-xs flex-shrink-0" />
                                  <span className="text-xs text-gray-900 dark:text-white truncate">{rec.mobile}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Education & Duration */}
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              {rec.college && (
                                <div className="flex items-center gap-2">
                                  <School className="text-gray-400 text-xs flex-shrink-0" />
                                  <span className="text-xs text-gray-900 dark:text-white truncate">{rec.college}</span>
                                </div>
                              )}
                              {rec.durationStart && rec.durationEnd && (
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <Assignment className="text-xs flex-shrink-0" />
                                  <span className="truncate">
                                    {new Date(rec.durationStart).toLocaleDateString()} → {new Date(rec.durationEnd).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Identification */}
                          <td className="px-4 py-4">
                            {rec.aadhar && (
                              <div className="flex items-center gap-2">
                                <Badge className="text-gray-400 text-xs flex-shrink-0" />
                                <span className="text-xs text-gray-900 dark:text-white font-mono truncate">{rec.aadhar}</span>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => navigate(`/admin/update/${rec._id}`)}
                                className="flex items-center gap-1 px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium border border-blue-200 dark:border-blue-800"
                                title="Edit Record"
                              >
                                <Edit className="text-xs" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(rec)}
                                className="flex items-center gap-1 px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-xs font-medium border border-red-200 dark:border-red-800"
                                title="Delete Record"
                              >
                                <Delete className="text-xs" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Person className="text-gray-400 text-4xl mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              No records found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md text-center">
                              {searchTerm 
                                ? "No records match your search criteria. Try adjusting your search terms." 
                                : "No intern records available. Add new records to get started."}
                            </p>
                            {searchTerm && (
                              <button
                                onClick={() => {
                                  setSearchTerm("");
                                  setCurrentPage(1);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                Clear Search
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
          {/* Mobile Card View for Intern Records */}
<div className="block lg:hidden">
  {currentRecords.length > 0 ? (
    currentRecords.map((rec) => (
      <div
        key={rec._id}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 shadow-sm"
      >
        {/* Personal Info */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Intern Name</p>
          <p className="text-gray-900 dark:text-white font-medium">
            {rec.name} {rec.middleName} {rec.lastName}
          </p>
        </div>

        <div className="mb-2 text-xs text-gray-600 dark:text-gray-400">
          <div>DOB: {rec.dob ? new Date(rec.dob).toLocaleDateString() : "No DOB"}</div>
          {rec.address && <div>Address: {rec.address}</div>}
        </div>

        {/* Contact Details */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Contact</p>
          {rec.email && <div className="text-gray-900 dark:text-white text-sm">Email: {rec.email}</div>}
          {rec.mobile && <div className="text-gray-900 dark:text-white text-sm">Mobile: {rec.mobile}</div>}
        </div>

        {/* Education & Duration */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500">Education</p>
          {rec.college && <div className="text-gray-900 dark:text-white text-sm">College: {rec.college}</div>}
          {rec.durationStart && rec.durationEnd && (
            <div className="text-gray-900 dark:text-white text-sm">
              Duration: {new Date(rec.durationStart).toLocaleDateString()} → {new Date(rec.durationEnd).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Identification */}
        {rec.aadhar && (
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-500">Aadhar</p>
            <p className="text-gray-900 dark:text-white text-sm font-mono">{rec.aadhar}</p>
          </div>
        )}

        {/* Actions - Full Buttons */}
        <div className="flex flex-col gap-2 mt-3">
          <button
            onClick={() => navigate(`/admin/update/${rec._id}`)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(rec)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 dark:text-gray-400 py-6">No intern records found</p>
  )}
</div>

          

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-1 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Records;