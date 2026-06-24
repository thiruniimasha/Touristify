import { Compass, Heart, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function navLinkClass({ isActive }) {
  return [
    'flex min-h-12 min-w-[4.5rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-xs transition-transform active:scale-90',
    isActive
      ? 'font-semibold text-emerald-600'
      : 'font-medium text-slate-400',
  ].join(' ')
}

export default function BottomNav() {
  return (
    <nav
      className="safe-bottom fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-slate-200 bg-white px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-full w-full max-w-lg items-center justify-around">
        <NavLink to="/" end className={navLinkClass}>
          <Compass size={22} strokeWidth={2} aria-hidden />
          <span>Home</span>
        </NavLink>

        <NavLink to="/favorites" className={navLinkClass}>
          <Heart size={22} strokeWidth={2} aria-hidden />
          <span>Favorites</span>
        </NavLink>

        <NavLink to="/profile" className={navLinkClass}>
          <User size={22} strokeWidth={2} aria-hidden />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  )
}
