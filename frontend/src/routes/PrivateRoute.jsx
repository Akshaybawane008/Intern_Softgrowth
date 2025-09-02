// src/routes/PrivateRoute.js
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) return <Navigate to="/login" />;
  if (auth.role !== role) return <Navigate to="/login" />;
  return children;
};

export default PrivateRoute;
