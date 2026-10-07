import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InviteesProvider } from "./context/InviteesContext";
import { DrinksProvider } from "./context/DrinksContext";
import { TablesProvider } from "./context/TablesContext";
import { UsersProvider } from "./context/UsersContext";
import RequireAuth from "./components/RequireAuth";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InviteesListPage from "./pages/InviteesListPage";
import InviteeFormPage from "./pages/InviteeFormPage";
import InviteeDetailPage from "./pages/InviteeDetailPage";
import ScannerPage from "./pages/ScannerPage";
import TablesPage from "./pages/TablesPage";
import DrinksPage from "./pages/DrinksPage";
import UsersPage from "./pages/UsersPage";
import PublicInvitationPage from "./pages/PublicInvitationPage";

function App() {
  return (
    <AuthProvider>
      <InviteesProvider>
        <TablesProvider>
          <DrinksProvider>
            <UsersProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Navigate to="/admin" replace />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/invitation/:id"
                    element={<PublicInvitationPage />}
                  />

                  <Route
                    path="/admin"
                    element={
                      <RequireAuth>
                        <AdminLayout />
                      </RequireAuth>
                    }
                  >
                    {/* Admin + Co-Admin pages (CO_ADMIN has the same read access, just no writes) - a Protocol account is redirected to /admin/scanner (RequireAuth) */}
                    <Route element={<RequireAuth roles={["ADMIN", "CO_ADMIN"]}><Outlet /></RequireAuth>}>
                      <Route index element={<DashboardPage />} />
                      <Route path="invites" element={<InviteesListPage />} />
                      <Route path="invites/:id" element={<InviteeDetailPage />} />
                      <Route path="tables" element={<TablesPage />} />
                      <Route path="boissons" element={<DrinksPage />} />
                      <Route path="utilisateurs" element={<UsersPage />} />
                    </Route>

                    {/* Pure write pages - ADMIN only, even CO_ADMIN can't create/edit invitees */}
                    <Route element={<RequireAuth roles={["ADMIN"]} fallback="/admin/invites"><Outlet /></RequireAuth>}>
                      <Route path="invites/nouveau" element={<InviteeFormPage />} />
                      <Route path="invites/:id/modifier" element={<InviteeFormPage />} />
                    </Route>

                    {/* Both ADMIN and PROTOCOL reach the scanner */}
                    <Route path="scanner" element={<ScannerPage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </Router>
            </UsersProvider>
          </DrinksProvider>
        </TablesProvider>
      </InviteesProvider>
    </AuthProvider>
  );
}

export default App;
