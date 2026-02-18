import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

export default PublicRoute;
