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

  const [errors, setErrors] = useState({}); // Validation errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Basic validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.college.trim()) newErrors.college = "College name is required";
    if (!formData.durationStart) newErrors.durationStart = "Internship start date is required";
    if (!formData.durationEnd) newErrors.durationEnd = "Internship end date is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.aadhar.trim()) newErrors.aadhar = "Aadhar number is required";
    else if (!/^\d{12}$/.test(formData.aadhar)) newErrors.aadhar = "Enter a valid 12-digit Aadhar";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Data (POST to API)
  const handleSave = async () => {
    if (!validate()) return;
    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    if (!validate()) return;
    try {
      const response = await fetch("http://localhost:5000/api/users/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-2xl text-gray-900 dark:text-white transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-center">Registration Form</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="First Name"
              value={formData.name}
              onChange={handleChange}
              className={`border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile No"
              value={formData.mobile}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>

          <div>
            <input
              type="text"
              name="college"
              placeholder="College Name"
              value={formData.college}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
          </div>

          <div>
            <input
              type="date"
              name="durationStart"
              value={formData.durationStart}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.durationStart && <p className="text-red-500 text-xs mt-1">{errors.durationStart}</p>}
          </div>

          <div>
            <input
              type="date"
              name="durationEnd"
              value={formData.durationEnd}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.durationEnd && <p className="text-red-500 text-xs mt-1">{errors.durationEnd}</p>}
          </div>
        </div>

        <div className="mt-4">
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="mt-4">
          <input
            type="text"
            name="aadhar"
            placeholder="Aadhar Number"
            value={formData.aadhar}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.aadhar && <p className="text-red-500 text-xs mt-1">{errors.aadhar}</p>}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Cancel
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
