import { useMemo } from 'react'
import { Compass, Bookmark, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFavorites } from '../../hooks/useFavorites'

const TABS = [
  { value: 'home', label: 'Explore', icon: Compass, route: '/' },
  { value: 'saved', label: 'Saved', icon: Bookmark, route: '/saved' },
  { value: 'profile', label: 'Profile', icon: User, route: '/profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { favoriteIds } = useFavorites()

  const activeTab = useMemo(() => {
    if (location.pathname === '/saved') return 'saved'
    if (location.pathname === '/profile') return 'profile'
    return 'home'
  }, [location.pathname])

  const savedCount = favoriteIds.length

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0B1528] border-t border-slate-800/80 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.2)] px-6 sm:px-16 md:px-32 lg:px-48 xl:px-64">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => navigate(tab.route)}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] cursor-pointer active:scale-95 transition-all text-[11px] ${isActive ? 'text-emerald-500 font-bold' : 'text-slate-400 hover:text-emerald-400'}`}
          >
            <span className="relative">
              <Icon size={20} strokeWidth={2.5} aria-hidden />
              {tab.value === 'saved' && savedCount > 0 && (
                <span className="absolute -right-2 -top-2 grid w-5 h-5 place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {savedCount}
                </span>
              )}
            </span>
            <span className="text-[11px] mt-1">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
