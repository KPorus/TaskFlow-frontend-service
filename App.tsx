import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootState, AppDispatch } from "./store/store";
import { AuthScreen } from "./components/auth/AuthScreen";
import { BoardView } from "./components/board/BoardView";
import { DashboardLayout } from "./screen/DashboardLayout";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import { loadUser, logoutUser } from "./store/slices/helper/authThunks";
import { SESSION_EXPIRED_EVENT } from "./helpers/sessionEvents";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(logoutUser());
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <AuthScreen /> : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="projects/:projectId" element={<BoardView />} />
        </Route>

        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
