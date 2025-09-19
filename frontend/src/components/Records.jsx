import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Records = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // Fetch data
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

  // Delete handler
  const handleDelete = async (rec) => {
    if (!window.confirm(`Delete ${rec.name} ${rec.lastName}?`)) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${rec._id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert(`Deleted ${rec.name} ${rec.lastName}`);
        setRecords((prev) => prev.filter((r) => r._id !== rec._id));
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    }
  };

  // Search + filter
  const filteredRecords = records
    .filter((rec) => {
      const fullName = `${rec.name || ""} ${rec.middleName || ""} ${
        rec.lastName || ""
      }`.toLowerCase();

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
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Intern Records</h2>

        {/* Search + Rows per page */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            className="border p-2 rounded-lg w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex items-center gap-2">
            <label className="font-medium">Rows:</label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 rounded-lg"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {currentRecords.length === 0 ? (
          <p className="text-center text-gray-600">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Mobile</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">DOB</th>
                  <th className="border p-2">College</th>
                  <th className="border p-2">Duration</th>
                  <th className="border p-2">Aadhar</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Update</th>
                  <th className="border p-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((rec, i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-2">
                      {rec.name} {rec.middleName} {rec.lastName}
                    </td>
                    <td className="border p-2">{rec.mobile}</td>
                    <td className="border p-2">{rec.email}</td>
                    <td className="border p-2">
                      {new Date(rec.dob).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{rec.college}</td>
                    <td className="border p-2">
                      {new Date(rec.durationStart).toLocaleDateString()} →{" "}
                      {new Date(rec.durationEnd).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{rec.aadhar}</td>
                    <td className="border p-2">{rec.address}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => navigate(`/admin/update/${rec._id}`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDelete(rec)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
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
