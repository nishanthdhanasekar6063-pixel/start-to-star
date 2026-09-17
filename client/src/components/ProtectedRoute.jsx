import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role, roles }) {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(savedUser);

  // Support both role="Startup"
  // and roles={["Startup", "Investor"]}
  const allowedRoles = roles || (role ? [role] : []);

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "Startup") {
      return <Navigate to="/startup-dashboard" replace />;
    }

    if (user.role === "Investor") {
      return <Navigate to="/investor-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;