import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { useApp } from './context/useApp'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Saved from './pages/Saved'
import Profile from './pages/Profile'
import Details from './pages/Details'


function AppContent() {
  const { user, loading } = useApp()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white font-bold">
        <div className="animate-pulse">Loading Touristify Cloud...</div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Onboarding Route */}
      <Route 
        path="/onboarding" 
        element={!user ? <Onboarding /> : <Navigate to="/" replace />} 
      />
      
      {/* 🏡 Home Route */}
      <Route 
        path="/" 
        element={user ? <Home /> : <Navigate to="/onboarding" replace />} 
      />

      {/* 🗺️ FIXED: Detail View Route එක එකතු කළා */}
      {/* Note: ඔයාගේ router එකේ යන්නේ slug එක නම් path="/attraction/:slug" විදිහට වෙනස් කරන්න */}
      <Route 
        path="/attraction/:id" 
        element={user ? <Details /> : <Navigate to="/onboarding" replace />} 
      />
      
      {/* 💙 Saved/Favorites Route */}
      <Route 
        path="/saved" 
        element={user ? <Saved /> : <Navigate to="/onboarding" replace />} 
      />
      
      {/* ⚙️ Profile Route */}
      <Route 
        path="/profile" 
        element={user ? <Profile /> : <Navigate to="/onboarding" replace />} 
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )

}


export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  )
}