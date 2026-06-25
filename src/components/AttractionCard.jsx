import { Bookmark, MapPin, Star, Mountain } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function ImageFallback({ alt }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-emerald-500 via-teal-500 to-blue-600"
      role="img"
      aria-label={alt}
    >
      <Mountain className="text-white/90" size={40} strokeWidth={1.5} aria-hidden />
      <span className="mt-2 px-4 text-center text-xs font-medium text-white/80">
        Image unavailable
      </span>
    </div>
  )
}

export default function AttractionCard({
  attraction,
  isFavorite,
  onToggleFavorite,
  onOpen,
}) {
  const [imageFailed, setImageFailed] = useState(false)

  function handleFavoriteClick(event) {
    event.preventDefault()
    event.stopPropagation()
    onToggleFavorite(attraction.slug)
  }

  const imageUrl = attraction.image || '/placeholder.svg'
  const emojiLabel = attraction.emoji ? `${attraction.emoji} ` : ''
  const distanceText = attraction.distanceKm
    ? `${attraction.distanceKm.toFixed(1)} km away`
    : 'Distance unavailable'

  return (
    <Link
      to={`/attraction/${attraction.slug}`}
      className="group relative block h-60 w-full overflow-hidden rounded-3xl text-left shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 active:scale-[0.98]"
      onClick={(event) => {
        if (onOpen) {
          event.preventDefault()
          onOpen(attraction)
        }
      }}
      aria-label={`View details for ${attraction.name}`}
    >
      <img
        src={imageFailed ? '/placeholder.svg' : imageUrl}
        alt={attraction.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/25 to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
        <div className="flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-800 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          {typeof attraction.rating === 'number'
            ? attraction.rating.toFixed(1)
            : '0.0'}
        </div>
        <span
          role="button"
          tabIndex={0}
          onClick={handleFavoriteClick}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              event.stopPropagation()
              onToggleFavorite(attraction.slug)
            }
          }}
          aria-label={
            isFavorite ? 'Remove bookmark' : 'Add bookmark'
          }
          className="grid h-9 w-9 place-items-center rounded-full bg-white/70 backdrop-blur-md transition-all duration-300 active:scale-90"
        >
          <Bookmark
            className={`h-4 w-4 transition-colors ${
              isFavorite
                ? 'fill-emerald-500 text-emerald-500'
                : 'text-slate-700'
            }`}
          />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {emojiLabel}
          {attraction.category}
        </span>
        <h3 className="text-balance text-lg font-bold leading-tight text-white">
          {attraction.name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between text-white/80">
          <span className="flex items-center gap-1 text-sm">
            <MapPin className="h-3.5 w-3.5" />
            {attraction.district || 'Unknown district'}
          </span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            🚗 {distanceText}
          </span>
        </div>
      </div>
    </Link>
  )
}
