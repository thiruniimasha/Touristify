import { Outlet } from 'react-router-dom'


export default function AppShell() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom navigation rendered by BottomNav (keeps AppShell minimal) */}
      
    </div>
  )
}
