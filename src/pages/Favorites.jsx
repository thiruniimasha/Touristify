import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteCard from '../components/favorites/FavoriteCard'
import { useAttractions } from '../hooks/useAttractions'
import { useFavorites } from '../hooks/useFavorites'

export default function Favorites() {
  const navigate = useNavigate()
  const { attractions, loading, error } = useAttractions()
  const { favoriteIds, removeFavorite } = useFavorites()

  const favoriteAttractions = useMemo(
    () => attractions.filter((item) => favoriteIds.includes(item.slug)),
    [attractions, favoriteIds],
  )

  const showEmptyState = !loading && !error && favoriteAttractions.length === 0

  return (
    <div className="min-h-full bg-slate-50 px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">
        Favorites
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Your saved places across Sri Lanka
      </p>

      {loading && (
        <p className="py-10 text-center text-sm text-slate-600">Loading...</p>
      )}

      {error && (
        <p className="py-10 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {showEmptyState && (
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-sm">
            <span className="text-2xl">♥</span>
          </div>
          <h2 className="mt-6 text-lg font-semibold text-slate-800">
            Your favorites list is empty.
          </h2>
          <p className="mt-3 max-w-md mx-auto text-sm leading-relaxed text-slate-600">
            Go back to Home to bookmark Sri Lanka's best destinations!
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-8 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-medium text-white transition-all active:scale-95"
          >
            Explore Destinations
          </button>
        </div>
      )}

      {!loading && !error && favoriteAttractions.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-4">
          {favoriteAttractions.map((attraction) => (
            <li key={attraction.slug}>
              <FavoriteCard
                attraction={attraction}
                onRemove={removeFavorite}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
