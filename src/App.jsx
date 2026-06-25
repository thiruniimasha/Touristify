import AppRouter from './routes/AppRouter'
import { AppProvider } from './context/AppContext'
import { useUser } from './hooks/useUser'
import Onboarding from './pages/Onboarding'

function AppContent() {
  const { user } = useUser()

  if (!user) {
    return <Onboarding />
  }

  return <AppRouter />
}

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans antialiased">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </div>
  )
}
