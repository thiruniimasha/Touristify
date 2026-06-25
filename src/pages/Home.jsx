import { AlertCircle, Loader2, RotateCw, Search, ChevronDown, MapPin, Heart, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { useUser } from '../hooks/useUser'
import { useFavorites } from '../hooks/useFavorites'
import { CATEGORIES } from '../utils/constants'
import BottomNav from '../components/layout/BottomNav'


export default function Home() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { attractions = [], districts = [], loading, error, refreshAttractions, simulatedDistrict, setSimulatedDistrict, getDistance, deviceCoords, gpsLoading } = useApp()
  const { favoriteIds = [], isFavorite, toggleFavorite } = useFavorites()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [syncing, setSyncing] = useState(false)
  const [enriched, setEnriched] = useState([])

  const districtOptions = useMemo(() => {
    const apiOpts = Array.isArray(districts) ? districts.map((d) => (typeof d === 'string' ? d : d?.name ?? d?.district)) : []
    if (apiOpts.length) return [...new Set(apiOpts.filter(Boolean))].sort()
    return [...new Set(attractions.map((a) => a.district).filter(Boolean))].sort()
  }, [districts, attractions])

  useEffect(() => {
    let mounted = true
    async function enrich() {
      if (!getDistance) {
        if (mounted) setEnriched(attractions.map((a) => ({ ...a })))
        return
      }

      const results = await Promise.all(
        attractions.map(async (a) => {
          try {
            const d = await getDistance(a.latitude, a.longitude, a.category)
            const match = String(d).match(/([0-9]+(?:\.[0-9]+)?)/)
            const km = match ? Number(match[1]) : null
            return { ...a, distanceKm: km }
          } catch {
            return { ...a, distanceKm: null }
          }
        }),
      )

      if (mounted) setEnriched(results)
    }

    enrich()
    return () => {
      mounted = false
    }
  }, [attractions, getDistance, simulatedDistrict])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return enriched.filter((a) => {
      const matchesCategory = category === 'All' || a.category === category
      const matchesQuery = q === '' || a.name.toLowerCase().includes(q) || (a.district || '').toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [enriched, category, query])

  const handleRefresh = async () => {
    setSyncing(true)
    await refreshAttractions()
    setTimeout(() => setSyncing(false), 500)
  }

  const handleDistrictChange = (value) => {
    // 'live' means use device GPS
    if (value === 'live' || value === 'Colombo' || value === '') {
      setSimulatedDistrict(null)
      return
    }

    const entry = districts.find((d) => (typeof d === 'string' ? d === value : d?.name === value || d?.district === value))
    if (entry && typeof entry !== 'string' && entry.latitude && entry.longitude) {
      setSimulatedDistrict({ name: entry.name ?? entry.district ?? value, latitude: Number(entry.latitude), longitude: Number(entry.longitude) })
      return
    }

    const match = attractions.find((a) => a.district === value)
    if (match) {
      setSimulatedDistrict({ name: value, latitude: Number(match.latitude), longitude: Number(match.longitude) })
    }
  }

  const activeDistrictName = simulatedDistrict?.name ?? (deviceCoords ? 'Live GPS' : 'Colombo')

  return (
    <div className="bg-slate-50 text-slate-900 w-full">
      {/* ========== 🌌 OBSIDIAN DARK BRAND HEADER ========== */}
        <header className="w-full shrink-0 bg-[#0B1528] px-6 py-5 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        {/* Left Side Container */}
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 font-medium tracking-wider">Ayubowan LK</p>
          <h1 className="text-xl font-extrabold tracking-tight mt-0.5">{user?.name ?? 'Hiruni Imasha'} ✨</h1>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">📍 Exploring near {activeDistrictName}</div>
        </div>

        {/* Center Container - Search Pill */}
          <div className="w-full max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, districts..."
              className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-emerald-500/50 pl-12"
            />
          </div>
        </div>

        {/* Right Side Container - Refresh Button */}
        <button
          onClick={handleRefresh}
          className="hidden sm:inline-flex items-center justify-center rounded-full border border-emerald-700 bg-emerald-700/10 p-2.5 text-emerald-400 hover:bg-emerald-700/20 transition h-fit"
          aria-label="Refresh attractions"
        >
          <RotateCw className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* ========== SCROLLABLE BODY CONTAINER ========== */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* ========== 🏷️ HORIZONTAL CATEGORY SCROLL ========== */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 px-6 no-scrollbar">
        {CATEGORIES.map((c) => {
          const isActive = category === c.value
          return (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={
                isActive
                  ? 'bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap hover:bg-slate-50 transition'
              }
            >
              <span className="inline-block mr-1">{c.emoji}</span>
              {c.label}
            </button>
          )
        })}
      </div>

      {/* ========== 🗺️ LOCATION SIMULATION WIDGET BAR ========== */}
      <div className="mx-6 my-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${simulatedDistrict ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600 animate-pulse'}`}>
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800">Location Context</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {gpsLoading
                ? 'Using Device Live GPS'
                : simulatedDistrict
                ? "Simulating location. Distances recalculated from the selected district."
                : "Tracking via your device's active live coordinates."}
            </p>
          </div>
        </div>

        <div className="relative min-w-fit w-full sm:w-auto">
          <select
            value={simulatedDistrict ? simulatedDistrict.name : 'live'}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 appearance-none pr-8 cursor-pointer"
            aria-label="Select district for simulation"
          >
            <option value="live">🟢 Current Live Location (Default)</option>
            {districtOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      
        {/* ========== COLUMN A: LEFT CONTENT STREAM (lg:col-span-8) ========== */}
        <section className="lg:col-span-8">
          <h2 className="mx-6 my-4 text-base font-black text-slate-800 mb-4 tracking-tight">Featured Places ({filtered.length} results)</h2>

          {/* ATTRACTION GRID CONTAINER (force 3 columns max) */}
          <div className="mx-6 my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-12 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                <span className="text-sm">Loading attractions...</span>
              </div>
            ) : error ? (
              <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-semibold">Unable to load attractions</p>
                </div>
                <p className="mt-2 text-sm">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm uppercase tracking-wider text-slate-400 mb-2">No results</p>
                <p className="text-slate-600 text-sm">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filtered.map((attraction) => (
                <div
                  key={attraction.slug}
                  className="rounded-[2rem] overflow-hidden border border-slate-100 bg-white shadow-sm relative group h-[280px] cursor-pointer"
                  onClick={() => navigate(`/attraction/${attraction.slug}`)}
                >
                  {/* Image Element */}
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Scrim Mask Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10" />

                  {/* Floating Badge Layer (z-20) */}
                  <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {attraction.rating || '4.5'}
                  </div>

                  {/* Bookmark/Heart Toggle (z-20) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(attraction.slug)
                    }}
                    className="absolute top-4 right-4 z-20 bg-white/90 text-emerald-600 p-2 rounded-full shadow hover:bg-white transition"
                    aria-label={isFavorite(attraction.slug) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(attraction.slug) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Absolute Bottom Metadata Content (z-20) */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    {/* Category Tag */}
                    <div className="bg-amber-500 text-slate-950 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded w-max">
                      {attraction.category}
                    </div>

                    {/* Title Text */}
                    <h3 className="text-base font-extrabold text-white mt-1.5 leading-tight line-clamp-2">{attraction.name}</h3>

                    {/* Bottom Info Line */}
                    <div className="flex justify-between items-center mt-2 w-full">
                      {/* Left: District/Location */}
                      <div className="text-slate-300 text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {attraction.district}
                      </div>

                      {/* Right: Distance Badge */}
                      <div className="bg-slate-900/60 backdrop-blur border border-white/10 text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {attraction.distanceKm ? `${attraction.distanceKm.toFixed(1)} km` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        
      </div>
      <BottomNav/>
      </div>
    
  )
}
