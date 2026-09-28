import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InviteesProvider } from "./context/InviteesContext";
import RequireAuth from "./components/RequireAuth";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InviteesListPage from "./pages/InviteesListPage";
import InviteeFormPage from "./pages/InviteeFormPage";
import InviteeDetailPage from "./pages/InviteeDetailPage";
import ScannerPage from "./pages/ScannerPage";
import PublicInvitationPage from "./pages/PublicInvitationPage";

function App() {
  return (
    <AuthProvider>
      <InviteesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/invitation/:id" element={<PublicInvitationPage />} />

            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="invites" element={<InviteesListPage />} />
              <Route path="invites/nouveau" element={<InviteeFormPage />} />
              <Route path="invites/:id" element={<InviteeDetailPage />} />
              <Route
                path="invites/:id/modifier"
                element={<InviteeFormPage />}
              />
              <Route path="scanner" element={<ScannerPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Router>
      </InviteesProvider>
    </AuthProvider>
  );
}

export default App;
