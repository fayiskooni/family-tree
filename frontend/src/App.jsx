import React from "react";
import { Routes, Route, Navigate } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import FamilyCreationPage from "./pages/FamilyCreationPage.jsx";
import FamilyRelationPage from "./pages/FamilyRelationPage.jsx";
import FamilyTreePage from "./pages/FamilyTreePage.jsx";

import useAuthUser from "./hooks/useAuthUser.js";
import PageLoader from "./components/PageLoader.jsx";

const App = () => {
   const { isLoading, authUser } = useAuthUser();

   const isAuthenticated = Boolean(authUser);

   if (isLoading) return <PageLoader />;
  
  return (
    <div className="h-screen" data-theme="dim">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/familycreation"
          element={authUser ? <FamilyCreationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/familyrelation"
          element={authUser ? <FamilyRelationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/familytree"
          element={authUser ? <FamilyTreePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
