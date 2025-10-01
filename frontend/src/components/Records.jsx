import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Records = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, []);

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

  const filteredRecords = records
    .filter((rec) => {
      const fullName = `${rec.name || ""} ${rec.middleName || ""} ${rec.lastName || ""}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) ||
             rec.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             rec.mobile?.toString().includes(searchTerm);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 w-full max-w-[1600px]">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">Intern Records</h2>

        {/* Search & Rows per page */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            className="border py-1 px-2 rounded w-full md:w-1/3 placeholder:text-xs bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Rows:</label>
            <select
              value={recordsPerPage}
              onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border p-1 text-sm rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              {[5,10,15,20,25].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-200 dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-100">
              <tr>
                <th className="border p-2 dark:border-gray-600">No</th>
                <th className="border p-1 dark:border-gray-600">Name</th>
                <th className="border p-1 dark:border-gray-600">Mobile</th>
                <th className="border p-1 dark:border-gray-600">Email</th>
                <th className="border p-1 dark:border-gray-600">DOB</th>
                <th className="border p-1 dark:border-gray-600">College</th>
                <th className="border p-1 dark:border-gray-600">Duration</th>
                <th className="border p-1 dark:border-gray-600">Aadhar</th>
                <th className="border p-1 dark:border-gray-600">Address</th>
                <th className="border p-1 dark:border-gray-600">Update</th>
                <th className="border p-1 dark:border-gray-600">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((rec, i) => (
                <tr key={i} className="text-center text-xs text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="border p-1 da rk:border-gray-600">{ i + 1}</td>
                  <td className="border p-1 dark:border-gray-600">{rec.name} {rec.middleName} {rec.lastName}</td>
                  <td className="border p-1 dark:border-gray-600">{rec.mobile}</td>
                  <td className="border p-1 dark:border-gray-600">{rec.email}</td>
                  <td className="border p-1 dark:border-gray-600">{new Date(rec.dob).toLocaleDateString()}</td>
                  <td className="border p-1 dark:border-gray-600">{rec.college}</td>
                  <td className="border p-1 dark:border-gray-600">{new Date(rec.durationStart).toLocaleDateString()} → {new Date(rec.durationEnd).toLocaleDateString()}</td>
                  <td className="border p-1 dark:border-gray-600">{rec.aadhar}</td>
                  <td className="border p-1 dark:border-gray-600">{rec.address}</td>
                  <td className="border p-1 dark:border-gray-600">
                    <button
                      onClick={() => navigate(`/admin/update/${rec._id}`)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </td>
                  <td className="border p-1 dark:border-gray-600">
                    <button
                      onClick={() => handleDelete(rec)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-2 gap-1 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50 text-xs"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i+1}
                onClick={() => setCurrentPage(i+1)}
                className={`px-2 py-1 border rounded text-xs ${
                  currentPage === i+1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                }`}
              >
                {i+1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50 text-xs"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Records;
