import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MapPin,
  Mountain,
  Navigation,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_ATTRACTIONS_URL } from '../utils/constants'
import { formatDistanceKm, haversineDistanceKm } from '../utils/haversine'

function HeroImageFallback({ alt }) {
  return (
    <div
      className="flex h-72 w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600"
      role="img"
      aria-label={alt}
    >
      <Mountain className="text-white/90" size={48} strokeWidth={1.5} aria-hidden />
    </div>
  )
}

const geolocationSupported =
  typeof navigator !== 'undefined' && 'geolocation' in navigator

function GeoDistanceCard({ latitude, longitude }) {
  const [distanceLabel, setDistanceLabel] = useState(null)
  const [geoError, setGeoError] = useState(null)
  const [geoLoading, setGeoLoading] = useState(geolocationSupported)

  useEffect(() => {
    if (!geolocationSupported) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distanceKm = haversineDistanceKm(
          position.coords.latitude,
          position.coords.longitude,
          latitude,
          longitude,
        )
        setDistanceLabel(formatDistanceKm(distanceKm))
        setGeoError(null)
        setGeoLoading(false)
      },
      () => {
        setGeoError('Location permission denied. Distance unavailable.')
        setDistanceLabel(null)
        setGeoLoading(false)
      },
    )
  }, [latitude, longitude])

  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
          <MapPin
            className="text-blue-600"
            size={20}
            strokeWidth={2}
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Your distance
          </p>
          {!geolocationSupported && (
            <p className="mt-1 text-sm text-slate-600" role="status">
              Geolocation is not supported on this device.
            </p>
          )}
          {geolocationSupported && geoLoading && (
            <p className="mt-1 text-sm text-slate-600">Calculating distance...</p>
          )}
          {geolocationSupported && !geoLoading && distanceLabel && (
            <p className="mt-1 text-base font-semibold text-slate-800">
              {distanceLabel}
            </p>
          )}
          {geolocationSupported && !geoLoading && geoError && (
            <p className="mt-1 text-sm text-slate-600" role="status">
              {geoError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Details() {
  const { id: slug } = useParams()
  const [attraction, setAttraction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadAttraction() {
      setLoading(true)
      setError(null)
      setImageFailed(false)
      setAttraction(null)

      try {
        const response = await fetch(API_ATTRACTIONS_URL)

        if (!response.ok) {
          throw new Error(
            `Unable to load destination details. Server responded with status ${response.status}.`,
          )
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Invalid attractions data format received from the API.')
        }

        const match = data.find((item) => item.slug === slug)

        if (!match) {
          throw new Error('Attraction not found.')
        }

        if (!cancelled) {
          setAttraction(match)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load attraction details.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAttraction()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <main
        className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50"
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
          Loading details...
        </p>
      </main>
    )
  }

  if (error || !attraction) {
    return (
      <main className="bg-slate-50 px-4 py-12">
        <div
          className="mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm"
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
              Could not load this destination
            </p>
            <p className="mt-1 text-sm text-red-600">
              {error ?? 'Attraction not found'}
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-medium text-emerald-600 transition-all active:scale-95"
          >
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${attraction.latitude},${attraction.longitude}`

  return (
    <div className="bg-slate-50">
      <div className="relative w-full">
        {imageFailed ? (
          <HeroImageFallback alt={attraction.name} />
        ) : (
          <img
            src={attraction.image}
            alt={attraction.name}
            className="h-72 w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        )}

        <Link
          to="/"
          className="absolute left-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-sm transition-all active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={2} aria-hidden />
        </Link>
      </div>

      <div className="relative z-10 -mt-6 space-y-5 rounded-t-3xl bg-slate-50 p-5 pt-8">
        <div>
          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {attraction.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-800">
            {attraction.name}
          </h1>
          <div className="mt-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-800">
              About this place
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm text-justify">
              {attraction.longDescription ?? attraction.description}
            </p>
          </div>
        </div>

        {Array.isArray(attraction.gallery) && attraction.gallery.length > 0 && (
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Gallery
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {attraction.gallery.map((imageUrl, index) => (
                <img
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`${attraction.name} gallery ${index + 1}`}
                  className="w-28 h-28 rounded-xl border border-slate-100 object-cover shadow-sm flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        <GeoDistanceCard
          key={attraction.slug}
          latitude={Number(attraction.latitude)}
          longitude={Number(attraction.longitude)}
        />

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-center text-sm font-medium text-white shadow-lg transition-all active:scale-[0.98] hover:bg-emerald-700"
        >
          <Navigation size={20} strokeWidth={2} aria-hidden />
          Navigate using Google Maps
        </a>
      </div>
    </div>
  )
}
