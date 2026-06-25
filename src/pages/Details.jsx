import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Clock, MapPin, Navigation, Star } from 'lucide-react'
import { useApp } from '../context/useApp'
import { useFavorites } from '../hooks/useFavorites'

function DetailsSkeleton({ onBack }) {
  return (
    <div className="flex min-h-100vh flex-col bg-slate-50">
      <div className="relative h-72 w-full animate-pulse bg-slate-200 lg:h-28rem">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/70 backdrop-blur-md active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-slate-800" />
        </button>
      </div>

      <div className="relative mx-auto -mt-6 w-full max-w-3xl flex-1 rounded-t-3xl bg-slate-50 px-5 pt-8 lg:px-8">
        <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-3 h-7 w-3/4 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
        </div>

        <div className="mt-6 h-5 w-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-3 space-y-2">
          <div className="h-3.5 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3.5 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-200" />
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="mt-6 flex gap-2">
          <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

export default function Details() {
  const { id: slug } = useParams()
  const navigate = useNavigate()
  const { attractions, loading, error, getDistance } = useApp()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [attraction, setAttraction] = useState(null)
  const [distanceLabel, setDistanceLabel] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      const found = attractions.find((item) => item.slug === slug) || null
      setAttraction(found)
      setImageFailed(false)
      setDetailsLoading(false)
    }
  }, [attractions, loading, slug])

  useEffect(() => {
    let cancelled = false

    async function calculateDistance() {
      if (!attraction) {
        return
      }

      setDistanceLabel('Calculating route simulation...')

      try {
        const label = await getDistance(
          attraction.latitude,
          attraction.longitude,
          attraction.category,
        )
        if (!cancelled) {
          setDistanceLabel(label)
        }
      } catch {
        if (!cancelled) {
          setDistanceLabel('Distance unavailable')
        }
      }
    }

    calculateDistance()

    return () => {
      cancelled = true
    }
  }, [attraction, getDistance])

  function handleBack() {
    navigate(-1)
  }

  if (loading || detailsLoading) {
    return <DetailsSkeleton onBack={handleBack} />
  }

  if (error && !attraction) {
    return (
      <main className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm" role="alert">
          <div className="flex items-start gap-3">
            <p className="text-sm font-semibold text-red-800">Unable to load destination</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald-700"
            >
              Return
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!attraction) {
    return (
      <main className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-center">
          <p className="text-sm font-semibold text-slate-800">Attraction not found</p>
          <p className="mt-2 text-sm text-slate-600">Please return to the home screen and select another destination.</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald-700"
          >
            Back
          </button>
        </div>
      </main>
    )
  }

  const heroImage = attraction.image || '/placeholder.svg'
  const title = attraction.name || 'Unknown place'
  const placeDescription = attraction.longDescription ?? attraction.description ?? 'No description available.'
  const placeDistrict = attraction.district || 'Unknown district'
  const placeDistance = attraction.distanceKm ? `${attraction.distanceKm.toFixed(1)} km away` : distanceLabel ?? 'Distance unavailable'
  const placeBestTime = attraction.bestTime || 'All year'
  const highlights = Array.isArray(attraction.highlights) ? attraction.highlights : []
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${attraction.latitude},${attraction.longitude}`
  const bookmarked = isFavorite(attraction.slug)

  return (
    <div className="flex min-h-100vh flex-col bg-slate-50">
      <div className="pb-28">
        <div className="relative h-72 w-full lg:h-28rem">
          <img src={heroImage} alt={title} className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
          <div className="absolute inset-0 bg-linear-to-t from-slate-50 via-transparent to-slate-900/30" />

          <div className="absolute inset-x-0 top-0 mx-auto flex w-full max-w-5xl items-center justify-between p-4 lg:px-8 lg:pt-6">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/70 backdrop-blur-md transition-all duration-300 active:scale-90"
            >
              <ArrowLeft className="h-5 w-5 text-slate-800" />
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(attraction.slug)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/70 backdrop-blur-md transition-all duration-300 active:scale-90"
            >
              <Bookmark
                className={`h-5 w-5 transition-colors ${
                  bookmarked ? 'fill-emerald-500 text-emerald-500' : 'text-slate-800'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="relative mx-auto -mt-6 max-w-3xl rounded-t-3xl bg-slate-50 px-5 pt-6 lg:px-8 lg:pt-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                {attraction.emoji ?? '📍'} {attraction.category}
              </span>
              <h1 className="mt-2 text-balance text-2xl font-bold leading-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-emerald-600" />
                {placeDistrict}
              </p>
            </div>
            
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200">
              <Navigation className="h-4 w-4 text-emerald-600" />
              <p className="mt-2 text-xs text-slate-400">Driving distance</p>
              <p className="font-bold text-slate-900">{placeDistance}</p>
            </div>
            <div className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200">
              <Clock className="h-4 w-4 text-emerald-600" />
              <p className="mt-2 text-xs text-slate-400">Best time</p>
              <p className="text-sm font-bold leading-tight text-slate-900">{placeBestTime}</p>
            </div>
          </div>

          <h2 className="mt-6 text-base font-bold text-slate-900">About this place</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{placeDescription}</p>

          <h2 className="mt-6 text-base font-bold text-slate-900">Highlights</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {highlights.length > 0 ? (
              highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                >
                  {highlight}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                No highlights available
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/80 px-5 pb-6 pt-3 backdrop-blur-md lg:px-8">
        <button
          type="button"
          onClick={() => window.open(mapsUrl, '_blank', 'noopener')}
          className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition-all duration-300 active:scale-[0.98]"
        >
          <Navigation className="h-4 w-4" />
          Start Navigation
        </button>
      </div>
    </div>
  )
}
