import { AlertCircle, Loader2, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AttractionCard from '../components/AttractionCard'
import { useUser } from '../hooks/useUser'
import { useFavorites } from '../hooks/useFavorites'
import { API_ATTRACTIONS_URL, CATEGORIES } from '../utils/constants'

export default function Home() {
  const { user } = useUser()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    let cancelled = false

    async function loadAttractions() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(API_ATTRACTIONS_URL)

        if (!response.ok) {
          throw new Error(
            `Unable to load destinations. Server responded with status ${response.status}.`,
          )
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Invalid attractions data format received from the API.')
        }

        if (!cancelled) {
          setAttractions(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong while loading destinations.',
          )
          setAttractions([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAttractions()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredAttractions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return attractions.filter((attraction) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        attraction.category === selectedCategory
      const matchesSearch =
        query.length === 0 ||
        attraction.name.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [attractions, selectedCategory, searchTerm])

  function handleClearSearch() {
    setSearchTerm('')
  }

  const hasSearchValue = searchTerm.trim().length > 0

  return (
    <div className="min-h-full bg-slate-50">
      <section className="space-y-3.5 border-b border-slate-100 bg-white px-4 pb-3.5 pt-4 shadow-sm">
        <header>
          <p className="text-xs font-medium tracking-wide text-emerald-600">
            Welcome back
          </p>
          <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-800">
            Hello, {user?.name ?? 'Explorer'} 👋
          </h1>
        </header>

        <div className="relative">
          <div
            className={[
              'relative flex min-h-12 items-center rounded-xl border border-slate-200/80 bg-white shadow-sm transition-colors duration-200',
              'focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15',
            ].join(' ')}
          >
            <Search
              className="pointer-events-none absolute left-3.5 text-slate-400"
              size={18}
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search locations..."
              className={[
                'min-h-12 w-full border-0 bg-transparent py-2.5 pl-10 text-sm text-slate-800 outline-none placeholder:text-slate-400',
                hasSearchValue ? 'pr-12' : 'pr-4',
              ].join(' ')}
              aria-label="Search locations by name"
            />
            {hasSearchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-r-xl text-slate-500 transition-all duration-200 active:scale-90 hover:bg-slate-50 hover:text-slate-800"
                aria-label="Clear search"
              >
                <X size={18} strokeWidth={2} aria-hidden />
              </button>
            )}
          </div>
        </div>

        <div
          className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-0.5"
          role="tablist"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={[
                  'inline-flex h-12 min-h-12 shrink-0 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out active:scale-95',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200/90 hover:bg-slate-50',
                ].join(' ')}
              >
                {category}
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-4 pt-3.5">
        {loading && (
          <div
            className="flex flex-col items-center justify-center px-4 py-12"
            role="status"
            aria-live="polite"
          >
            <Loader2
              className="animate-spin text-emerald-600"
              size={32}
              strokeWidth={2}
              aria-hidden
            />
            <p className="mt-3 text-sm font-medium text-slate-600">
              Loading destinations...
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            className="mx-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm"
            role="alert"
          >
            <AlertCircle
              className="mt-0.5 shrink-0 text-red-500"
              size={20}
              strokeWidth={2}
              aria-hidden
            />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Could not load destinations
              </p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filteredAttractions.length === 0 && (
          <div className="flex min-h-[38vh] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 shadow-sm">
              <Search size={28} strokeWidth={1.8} aria-hidden />
            </div>
            <h2 className="mt-6 text-lg font-semibold text-slate-800">
              No locations match your search.
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
              Try discovering something else!
            </p>
          </div>
        )}

        {!loading && !error && filteredAttractions.length > 0 && (
          <ul className="grid grid-cols-1 gap-5 px-4">
            {filteredAttractions.map((attraction) => (
              <li key={attraction.slug}>
                <AttractionCard
                  attraction={attraction}
                  isFavorite={isFavorite(attraction.slug)}
                  onToggleFavorite={toggleFavorite}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
