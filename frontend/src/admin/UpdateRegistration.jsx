import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateRegistration() {
  const token = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth")).token
    : null;

  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    dob: "",
    college: "",
    durationStart: "",
    durationEnd: "",
    address: "",
    aadhar: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
        });
        const data = await res.json();
        if (data.success) {
          setFormData(data.user);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [id, token]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Update user
  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", auth: token },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      console.log("Updated:", result);
      alert(result.message);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  if (loading) return <p className="p-6 dark:text-gray-200">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Update Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="First Name"
            value={formData.name}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile No"
            value={formData.mobile}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
          <input
            type="text"
            name="college"
            placeholder="College Name"
            value={formData.college}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
          <input
            type="date"
            name="durationStart"
            value={formData.durationStart}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
          <input
            type="date"
            name="durationEnd"
            value={formData.durationEnd}
            onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full"
          />
        </div>

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full mt-4"
        />
        <input
          type="text"
          name="aadhar"
          placeholder="Aadhar Number"
          value={formData.aadhar}
          onChange={handleChange}
          className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-lg w-full mt-4"
        />

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/admin/records")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateRegistration;
