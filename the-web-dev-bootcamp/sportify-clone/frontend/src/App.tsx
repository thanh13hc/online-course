import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./components/layout/MainLayout";
import ChatPage from "./pages/ChatPage";
import AlbumPage from "./pages/AlbumPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/chat" element={<ChatPage />}></Route>
          <Route path="/albums/:albumId" element={<AlbumPage />}></Route>
        </Route>

        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/auth-callback" />
          }
        ></Route>
        <Route path="/auth-callback" element={<AuthCallbackPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
