import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppShell() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-lg bg-slate-50">
      <main className="overflow-x-hidden pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
