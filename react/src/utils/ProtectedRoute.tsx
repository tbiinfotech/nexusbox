import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, path }) => {
  const users = useSelector((state) => state.user);
  const { isAuthenticated } = users;

  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
