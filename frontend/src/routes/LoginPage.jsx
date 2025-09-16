import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // false = Intern login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(isAdmin ? "Admin Login" : "Intern Login", { email, password });

    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, role } = res.data;
      console.log("Login successful:", res.data);

      if (!token) {
        alert("Login failed: No token received");
        return;
      }

      // Check role against selected login mode
      if (isAdmin && role !== "admin") {
        alert("You must log in as Admin!");
        return;
      }

      if (!isAdmin && role !== "intern") {
        alert("You must log in as Intern!");
        return;
      }

      // Store token + role
      const auth = { token, role };
      localStorage.setItem("auth", JSON.stringify(auth));

      // Navigate by role
      if (role === "admin") {
        navigate("/admin/home");
      } else if (role === "intern") {
        navigate("/intern/home");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm"
      >
        {/* Dynamic title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {isAdmin ? "Admin Login" : "Intern Login"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {/* Toggle between Admin <-> Intern */}
        <p
          className="text-center text-blue-600 cursor-pointer mt-4"
          onClick={() => setIsAdmin(!isAdmin)}
        >
          {isAdmin ? "Login as Intern" : "Login as Admin"}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
