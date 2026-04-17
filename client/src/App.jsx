import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import AppLayout from "./components/layout/AppLayout";
import { ThemeProvider } from "./context/ThemeContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import UsersPage from "./pages/users/UsersPage";
import UserDetailPage from "./pages/users/UserDetailPage";
import CreateUserPage from "./pages/users/CreateUserPage";
import EditUserPage from "./pages/users/EditUserPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { USER_ROLES } from "./constants/appConstants";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />

              <Route
                path="users"
                element={
                  <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
                    <UsersPage />
                  </RoleRoute>
                }
              />
              <Route
                path="users/:id"
                element={
                  <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
                    <UserDetailPage />
                  </RoleRoute>
                }
              />
              <Route
                path="users/:id/edit"
                element={
                  <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
                    <EditUserPage />
                  </RoleRoute>
                }
              />
              <Route
                path="create-user"
                element={
                  <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                    <CreateUserPage />
                  </RoleRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "bg-white text-slate-900 dark:bg-gray-800 dark:text-gray-100",
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
