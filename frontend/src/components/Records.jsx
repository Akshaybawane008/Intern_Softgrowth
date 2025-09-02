import React, { useEffect, useState } from "react";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // 5 record show

  // Fetch data from backend API
  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/registration"); // backend API
  //       const data = await response.json();
  //       setRecords(data);
  //     } catch (error) {
  //       console.error("Error fetching records:", error);
  //     }
  //   };

  //   fetchRecords();
  // }, []);


  // Dummy data input
  useEffect(() => {
    
    const dummyData = [
      {
        name: "Neil",
        middleName: "ff",
        lastName: "fgm",
        mobile: "9876543210",
        email: "test@example.com",
        dob: "2000-01-01",
        college: "ABC College",
        durationStart: "2025-01-01",
        durationEnd: "2025-06-01",
        address: "Pune, India",
        aadhar: "1234-5678-9012",
      },
      {
        name: "Neil",
        middleName: "ff",
        lastName: "fgm",
        mobile: "9876543210",
        email: "test@example.com",
        dob: "2000-01-01",
        college: "ABC College",
        durationStart: "2025-01-01",
        durationEnd: "2025-06-01",
        address: "Pune, India",
        aadhar: "1234-5678-9012",
      },{
        name: "Neil",
        middleName: "ff",
        lastName: "fgm",
        mobile: "9876543210",
        email: "test@example.com",
        dob: "2000-01-01",
        college: "ABC College",
        durationStart: "2025-01-01",
        durationEnd: "2025-06-01",
        address: "Pune, India",
        aadhar: "1234-5678-9012",
      },{
        name: "Neil",
        middleName: "ff",
        lastName: "fgm",
        mobile: "9876543210",
        email: "test@example.com",
        dob: "2000-01-01",
        college: "ABC College",
        durationStart: "2025-01-01",
        durationEnd: "2025-06-01",
        address: "Pune, India",
        aadhar: "1234-5678-9012",
      },{
        name: "Neil",
        middleName: "ff",
        lastName: "fgm",
        mobile: "9876543210",
        email: "test@example.com",
        dob: "2000-01-01",
        college: "ABC College",
        durationStart: "2025-01-01",
        durationEnd: "2025-06-01",
        address: "Pune, India",
        aadhar: "1234-5678-9012",
      },{
        name: "Neil",
        middleName: "ff",
        lastName: "fgm",
        mobile: "9876543210",
        email: "test@example.com",
        dob: "2000-01-01",
        college: "ABC College",
        durationStart: "2025-01-01",
        durationEnd: "2025-06-01",
        address: "Pune, India",
        aadhar: "1234-5678-9012",
      },

    ];
    setRecords(dummyData);
  }, []);

  // Search code

  const filteredRecords = records.filter((rec) => {
    const fullName = `${rec.name} ${rec.middleName} ${rec.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      rec.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.mobile?.includes(searchTerm)
    );
  });

  // table list code
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Intern Records</h2>

        
        <input
          type="text"
          placeholder="Search by name, email, or mobile..."
          className="border p-2 rounded-lg w-100 mb-4"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page when searching
          }}
        />

       
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
                  <td className="border p-2">{rec.dob}</td>
                  <td className="border p-2">{rec.college}</td>
                  <td className="border p-2">
                    {rec.durationStart} → {rec.durationEnd}
                  </td>
                  <td className="border p-2">{rec.aadhar}</td>
                  <td className="border p-2">{rec.address}</td>
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
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
