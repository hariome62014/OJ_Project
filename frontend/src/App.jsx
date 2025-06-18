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
import ForgotPasswordPage from './pages/ForgotPasswordpage'
import ResetPassword from "./pages/ResetPassword";
import Contests from "./pages/ContestPage";
import Leaderboard from "./pages/LeaderBoardPage";

const App = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state) => state.profile.user);

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

  // Auth route component (for login/register when already authenticated)
  const AuthRoute = ({ children }) => {
    return user ? <Navigate to={user.role === "admin" ? "/admin-profile" : (user.role==="user"?"/profile":"/")} /> : children;
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container flex flex-col min-h-screen">
        <Navbar />
       
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
          <Route path="/contests" element={<Contests />} />
          <Route path="/leaderboard" element={<Leaderboard />} />


          <Route
            path="/problems/:problemId"
            element={
              <ProtectedRoute>
                <ProblemPage />
              </ProtectedRoute>
            }
          />

          <Route path="/admin-problem-list" element={<AdminProblemsPage />} />
         
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            } 
          />
          <Route path="/verify-otp" element={
            <OtpVerificationPage />} />

          <Route path='/forgot-password' element={
             <AuthRoute>
            <ForgotPasswordPage/>
            </AuthRoute>
          }/>

          
           <Route path="/update-password/:id" element={
             <AuthRoute>
            <ResetPassword />
            </AuthRoute>
          } />

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
                {user && user.role === "admin" ? <AdminProfilePage /> : <Navigate to="/" />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-problem"
            element={
              <ProtectedRoute>
                {user && user.role === "admin" ? <CreateProblemPage /> : <Navigate to="/" />}
              </ProtectedRoute>
            }
          />

          {/* Admin home route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {user && user.role === "admin" ? <AdminHomePage /> : <Navigate to="/" />}
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
       
      </div>
    </ThemeProvider>
  );
};

export default App;