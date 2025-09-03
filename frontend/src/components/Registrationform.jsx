import { useState } from "react";

const Registrationform = () => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Data (POST to API)
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("✅ Saved:", data);
      alert("Data saved successfully!");
    } catch (error) {
      console.error("❌ Error saving data:", error);
      alert("Failed to save data");
    }
  };

  // Update Data (PUT to API)
  const handleUpdate = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/registration/123", {
        method: "PUT", // or PATCH
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("✅ Updated:", data);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("❌ Error updating data:", error);
      alert("Failed to update data");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Registration Form</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="First Name" value={formData.name} onChange={handleChange} className="border p-2 rounded-lg w-full" />
          <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} className="border p-2 rounded-lg w-full" />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="border p-2 rounded-lg w-full" />
          <input type="text" name="mobile" placeholder="Mobile No" value={formData.mobile} onChange={handleChange} className="border p-2 rounded-lg w-full" />
          <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} className="border p-2 rounded-lg w-full" />
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border p-2 rounded-lg w-full" />
          <input type="text" name="college" placeholder="College Name" value={formData.college} onChange={handleChange} className="border p-2 rounded-lg w-full" />
          <input type="date" name="durationStart" value={formData.durationStart} onChange={handleChange} className="border p-2 rounded-lg w-full" />
          <input type="date" name="durationEnd" value={formData.durationEnd} onChange={handleChange} className="border p-2 rounded-lg w-full" />
        </div>

        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border p-2 rounded-lg w-full mt-4" />
        <input type="text" name="aadhar" placeholder="Aadhar Number" value={formData.aadhar} onChange={handleChange} className="border p-2 rounded-lg w-full mt-4" />

        <div className="flex justify-between mt-6">
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Update
          </button>
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registrationform;
