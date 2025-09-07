import  { useEffect, useState } from "react";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // Fetch data from backend API
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/user/"); // backend API
        const data = await response.json();
        console.log("userData = ", data);
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  // ✅ Delete handler
  const handleDelete = async (rec) => {
    if (!window.confirm(`Are you sure you want to delete ${rec.name} ${rec.lastName}?`)) {
      return;
    }

    try {
      // Call backend delete API (assuming you use rec._id as unique ID)
      const response = await fetch(`http://localhost:4000/api/user/${rec._id}`, {method: "DELETE" });


      if (response.ok) {
        alert(`Details of ${rec.name} ${rec.lastName} deleted successfully`);
        // update state locally
        setRecords((prev) => prev.filter((r) => r._id !== rec._id));
      } else {
        alert("Failed to delete record");
        console.log(response)
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    }
  };

  // Search code
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
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Intern Records</h2>
        <div className="flex flex-row justify-between items-center mb-4 gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            className="border p-2 rounded-lg w-100 mb-4"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex justify-end mb-3">
            <label className="mr-2 font-medium mt-2">Rows per page:</label>
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

        {currentRecords.length === 0 ? (
          <p className="text-center text-gray-600">No records found.</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Mobile No.</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">DOB</th>
                <th className="border p-2">College Name</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Aadhar No.</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Details</th>
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
                      onClick={() =>
                        alert(`Details of ${rec.name} ${rec.lastName}`)
                      }
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden 
                     text-sm font-medium text-gray-900 rounded-lg group 
                     bg-gradient-to-br from-cyan-500 to-blue-500 
                     group-hover:from-cyan-500 group-hover:to-blue-500 
                     hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                     focus:ring-cyan-200 dark:focus:ring-cyan-800"
                    >
                      <span
                        className="relative px-5 py-2.5 transition-all ease-in duration-75 
                           bg-white dark:bg-gray-900 rounded-md 
                           group-hover:bg-transparent group-hover:dark:bg-transparent"
                      >
                        View
                      </span>
                    </button>
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(rec)}
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden 
                     text-sm font-medium text-gray-900 rounded-lg group 
                     bg-gradient-to-br from-red-500 to-pink-500 
                     group-hover:from-red-500 group-hover:to-pink-500 
                     hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                     focus:ring-red-200 dark:focus:ring-red-800"
                    >
                      <span
                        className="relative px-5 py-2.5 transition-all ease-in duration-75 
                           bg-white dark:bg-gray-900 rounded-md 
                           group-hover:bg-transparent group-hover:dark:bg-transparent"
                      >
                        Delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-lg ${
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
              className="px-3 py-1 border rounded-lg bg-gray-200 disabled:opacity-50"
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
