import { Heart, Mountain } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FavoriteCard({ attraction, onRemove }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-md">
      <Link to={`/attraction/${attraction.slug}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-200">
          {imageFailed ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to from-emerald-500 to-blue-600">
              <Mountain className="text-white/90" size={24} aria-hidden />
            </div>
          ) : (
            <img
              src={attraction.image}
              alt={attraction.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
        <span className="text-xs font-semibold text-emerald-700">
          {attraction.category}
        </span>
        <Link to={`/attraction/${attraction.slug}`}>
          <h2 className="truncate text-sm font-semibold text-slate-800">
            {attraction.name}
          </h2>
        </Link>
      </div>
      <button
        type="button"
        onClick={() => onRemove(attraction.slug)}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-emerald-600 transition-all active:scale-95 hover:bg-emerald-50"
        aria-label={`Remove ${attraction.name} from favorites`}
      >
        <Heart size={20} strokeWidth={2} className="fill-emerald-600" />
      </button>
    </article>
  )
}
