import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const publicRoutes = ["/login", "/signup"];

function NavigateRoute({ children, isPrivate }) {
  const { authUser } = useAuthContext();
  const location = useLocation();

  const isPublic = publicRoutes.includes(location.pathname);

  if (!authUser && !isPublic) return <Navigate to="/login" />;
  if (authUser && !isPrivate && isPublic) return <Navigate to="/" />;

  return <>{children}</>;
}

export default NavigateRoute;
