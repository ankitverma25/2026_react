import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import useAuth from './hooks/useAuth.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import TasksPage from './pages/TasksPage.jsx'
import InsightsPage from './pages/InsightsPage.jsx'
import './App.css'

function ProtectedRoute() {
  const { user, checkingAuth } = useAuth()

  // Yahan conditional rendering isliye use ki hai kyunki session check ke dauran spinner, aur uske baad logged-out user ke liye login redirect chahiye.
  if (checkingAuth) return <div className="route-loader">Checking your session...</div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          {/* Yahan React Router nested route isliye use ki hai kyunki tasks aur insights protected dashboard shell, sidebar, aur header share karte hain. */}
          <Routes>
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<DashboardLayout />}>
                <Route index element={<TasksPage />} />
                <Route path="insights" element={<InsightsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
