import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useThemeStore } from "./store/useThemeStore";
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <UnprotectedRoute>
              <SignupPage />
            </UnprotectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <UnprotectedRoute>
              <LoginPage />
            </UnprotectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to="/login" />;
  return <>{children}</>;
};

const UnprotectedRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (authUser) return <Navigate to="/" />;
  return <>{children}</>;
};

export default App;
