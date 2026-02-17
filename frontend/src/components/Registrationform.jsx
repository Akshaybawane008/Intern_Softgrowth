import { useState } from "react";

const RegistrationForm = () => {
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

  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
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

  const sections = [
    {
      title: "Personal Information",
      fields: ["name", "middleName", "lastName", "mobile", "email", "dob"]
    },
    {
      title: "Academic Details",
      fields: ["college", "durationStart", "durationEnd"]
    },
    {
      title: "Additional Information",
      fields: ["address", "aadhar"]
    }
  ];

  const getFieldComponent = (fieldName) => {
    const commonProps = {
      name: fieldName,
      value: formData[fieldName],
      onChange: handleChange,
      className: `w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
        errors[fieldName] 
          ? "border-red-500 focus:border-red-500" 
          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`
    };

    switch (fieldName) {
      case "dob":
      case "durationStart":
      case "durationEnd":
        return <input type="date" {...commonProps} />;
      case "email":
        return <input type="email" placeholder="Enter your email" {...commonProps} />;
      case "mobile":
        return <input type="tel" placeholder="10-digit mobile number" {...commonProps} />;
      case "aadhar":
        return <input type="text" placeholder="12-digit Aadhar number" {...commonProps} />;
      case "address":
        return <textarea placeholder="Enter your complete address" rows="3" {...commonProps} />;
      default:
        const placeholder = fieldName
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        return <input type="text" placeholder={`Enter ${placeholder}`} {...commonProps} />;
    }
  };

  const nextSection = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };

  const prevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Student Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Complete your internship registration form
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-colors">
          {/* Progress Bar */}
          <div className="px-8 pt-8">
            <div className="flex items-center justify-between mb-8">
              {sections.map((section, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      index <= activeSection
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-3 font-medium hidden sm:block ${
                      index <= activeSection
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {section.title}
                  </span>
                  {index < sections.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-4 transition-all duration-300 ${
                        index < activeSection ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 pb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {sections[activeSection].title}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>

            <div className="space-y-6">
              {sections[activeSection].fields.map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    {field !== "middleName" && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {getFieldComponent(field)}
                  {errors[field] && (
                    <p className="text-red-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={prevSection}
                disabled={activeSection === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeSection === 0
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                Previous
              </button>

              {activeSection === sections.length - 1 ? (
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdate}
                    className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Save & Submit
                  </button>
                </div>
              ) : (
                <button
                  onClick={nextSection}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-gray-500 dark:text-gray-400 text-sm">
          <p>All fields marked with <span className="text-red-500">*</span> are required</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;