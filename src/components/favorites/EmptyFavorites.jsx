import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
        <Heart size={24} strokeWidth={2} aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-800">No favorites yet</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
        Tap the heart on any location to save it here for quick access.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-150 active:scale-95 hover:bg-blue-700"
      >
        Discover places
      </Link>
    </div>
  )
}
