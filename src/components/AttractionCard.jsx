import { Heart, Mountain } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function ImageFallback({ alt }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600"
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
}) {
  const [imageFailed, setImageFailed] = useState(false)

  function handleFavoriteClick(event) {
    event.preventDefault()
    event.stopPropagation()
    onToggleFavorite(attraction.slug)
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      <div className="relative">
        <Link
          to={`/attraction/${attraction.slug}`}
          className="block active:scale-[0.99] transition-transform duration-150"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-slate-200">
            {imageFailed ? (
              <ImageFallback alt={attraction.name} />
            ) : (
              <img
                src={attraction.image}
                alt={attraction.name}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
              />
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-all active:scale-90"
          aria-label={
            isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
          aria-pressed={isFavorite}
        >
          <Heart
            size={20}
            strokeWidth={2}
            className={
              isFavorite
                ? 'fill-emerald-600 text-emerald-600'
                : 'text-slate-700'
            }
          />
        </button>
      </div>

      <div className="p-4 text-left">
        <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {attraction.category}
        </span>
        <Link to={`/attraction/${attraction.slug}`}>
          <h2 className="mt-2 text-base font-semibold leading-snug text-slate-800">
            {attraction.name}
          </h2>
        </Link>
      </div>
    </article>
  )
}
