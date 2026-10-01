import { useState } from "react";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/signup/SignupPage";
import HomePage from "./pages/home/HomePage";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavigateRoute from "./components/NavigateRoute";
function App() {
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={
            <NavigateRoute isPrivate>
              <HomePage />
            </NavigateRoute>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <NavigateRoute>
              <LoginPage />
            </NavigateRoute>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <NavigateRoute>
              <SignUpPage />
            </NavigateRoute>
          }
        ></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
