import { Bookmark, LogOut, Mail, MapPinned, Phone } from 'lucide-react'
import { useUser } from '../hooks/useUser'
import { useFavorites } from '../hooks/useFavorites'

const PLACES_VISITED = 12

export default function Profile() {
  const { user, logout } = useUser()
  const { favoriteIds } = useFavorites()

  if (!user) {
    return null
  }

  const initial = user.name.charAt(0).toUpperCase()
  const favoritesCount = favoriteIds.length
  const isEmail = user.contact.includes('@')

  return (
    <div className="min-h-full bg-slate-50 px-4 pb-6 pt-6">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-800">
          Profile
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">Your travel identity</p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-md">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-3xl font-bold text-white shadow-lg shadow-emerald-600/30"
          aria-hidden
        >
          {initial}
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-800">{user.name}</h2>
        <p className="mt-1 inline-flex items-center justify-center gap-2 text-sm text-slate-600">
          {isEmail ? (
            <Mail size={16} strokeWidth={2} className="text-emerald-600" />
          ) : (
            <Phone size={16} strokeWidth={2} className="text-emerald-600" />
          )}
          {user.contact}
        </p>
      </div>

      <section className="mt-6" aria-labelledby="travel-stats-heading">
        <h3
          id="travel-stats-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Travel Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <MapPinned
                size={20}
                strokeWidth={2}
                className="text-emerald-600"
                aria-hidden
              />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-800">
              {PLACES_VISITED}
            </p>
            <p className="text-xs text-slate-500">Places Visited</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Bookmark
                size={20}
                strokeWidth={2}
                className="text-blue-600"
                aria-hidden
              />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-800">
              {favoritesCount}
            </p>
            <p className="text-xs text-slate-500">Favorites Bookmarked</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <button
          type="button"
          onClick={logout}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 text-sm font-medium text-red-600 transition-all active:scale-95"
        >
          <LogOut size={18} strokeWidth={2} aria-hidden />
          Log Out / Reset Profile
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">
          This clears your profile and returns you to onboarding.
        </p>
      </section>
    </div>
  )
}
