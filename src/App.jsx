import AppRouter from './routes/AppRouter'
import { UserProvider } from './context/UserProvider'
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
    <div className="relative min-h-screen w-full bg-slate-50">
      <UserProvider>
        <AppContent />
      </UserProvider>
    </div>
  )
}
