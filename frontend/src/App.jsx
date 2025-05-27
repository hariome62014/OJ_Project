import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Layout Components
import Navbar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
// import Sidebar from './components/layout/Sidebar';
import AdminProblemsPage from "./components/dashboard/AdminProblemDashboard";

// // Core Pages
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AdminProfilePage from "./pages/AdminProfilePage";
import AdminHomePage from "./pages/AdminHomePage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/SignupPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import LearnerHomePage from "./pages/LearnerHomePage";
import ProblemListPage from "./pages/ProblemListPage";
import ProblemPage from "./pages/ProblemWithCompilerPage";
import CreateProblemPage from "./components/ProblemComponents/CreateProblem";
// import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// // Error Pages
// import NotFoundPage from './pages/errors/NotFoundPage';
// import UnauthorizedPage from './pages/errors/UnauthorizedPage';

const App = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state) => state.profile.user);

  // console.log("User on App.jsx",user);

  const dispatch = useDispatch();

  // Create MUI theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#F1C40F", // Judge Gold
      },
      secondary: {
        main: "#3498DB", // Pending Blue
      },
      error: {
        main: "#E74C3C", // Reject Red
      },
      success: {
        main: "#2ECC71", // Accept Green
      },
      background: {
        default: darkMode ? "#121212" : "#FFFFFF",
        paper: darkMode ? "#1E1E1E" : "#F8F9FA",
      },
    },
    typography: {
      fontFamily: ["Fira Code", "Roboto", "Arial", "sans-serif"].join(","),
    },
  });

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />
      {/* <div className="main-content flex flex-1">
              <Sidebar />
              <div className="page-content flex-1 p-4"> */}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminHomePage />
              ) : (
                <LearnerHomePage />
              )
            ) : (
              <HomePage />
            )
          }
        />

        <Route path="/problems" element={<ProblemListPage />} />

       
          <Route
            path="/problems/:problemId"
            element={
              <ProtectedRoute>
                <ProblemPage />
              </ProtectedRoute>
            }
          />
      

        <Route path="/admin-problem-list" element={<AdminProblemsPage />} />
        {/* <Route path="/problems/:id" element={<ProblemDetailPage />} />
                  <Route path="/contests" element={<ContestsPage />} />
                  <Route path="/contests/:id" element={<ContestDetailPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} /> 
                   */}
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> */}

        {/* Protected Routes */}
        {/* <Route path="/submit/:problemId" element={
                    <ProtectedRoute>
                      <SubmitSolutionPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/submissions" element={
                    <ProtectedRoute>
                      <SubmissionsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/submissions/:id" element={
                    <ProtectedRoute>
                      <SubmissionDetailPage />
                    </ProtectedRoute>
                  } />*/}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute>
              {user && user.role === "admin" && <AdminProfilePage />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-problem"
          element={
            <ProtectedRoute>
              {user && user.role === "admin" && <CreateProblemPage />}
            </ProtectedRoute>
          }
        />

        {/* Error Routes */}
        {/* <Route path="/unauthorized" element={<UnauthorizedPage />} />*/}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
      {/* </div>
            </div> */}
      {/* <Footer /> */}
    </div>
  );
};

export default App;
