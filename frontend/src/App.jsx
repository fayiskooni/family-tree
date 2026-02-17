import React from "react";
import { Routes, Route, Navigate } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MembersPage from "./pages/MembersPage.jsx";

import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import PageLoader from "./components/PageLoader.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

import { Toaster } from "sonner";
import FamilyPage from "./pages/FamilyPage.jsx";
import MemberDetailsPage from "./pages/MemberDetailsPage.jsx";
import { ReactFlowProvider } from "@xyflow/react";
import FamilyTreePage from "./pages/FamilyTreePage.jsx";
import HowToUse from "./pages/HowToUse.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/members"
          element={
            authUser ? (
              <Layout showSidebar={true}>
                <MembersPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/family/:id"
          element={
            authUser ? (
              <Layout showSidebar={true}>
                <FamilyPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/treeView/family/:id"
          element={
            authUser ? (
              <Layout showSidebar={true} hideLogout={true}>
                <ReactFlowProvider>
                  <div className="w-full h-[calc(100vh-80px)]">
                    <FamilyTreePage />
                  </div>
                </ReactFlowProvider>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/member/:id"
          element={
            authUser ? (
              <Layout showSidebar={true}>
                <MemberDetailsPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/userGuide"
          element={
            authUser ? (
              <Layout showSidebar={true}>
                <HowToUse />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
