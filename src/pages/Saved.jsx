import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { useFavorites } from '../hooks/useFavorites'
import { useUser } from '../hooks/useUser' // ✅ FIXED: Missing hook import added
import { MapPin, Heart } from 'lucide-react'
import BottomNav from '../components/layout/BottomNav'

export default function Saved() {
  const navigate = useNavigate()
  const { attractions = [] } = useApp()
  const { favoriteIds = [], isFavorite, toggleFavorite } = useFavorites()
  const { user } = useUser() // ✅ FIXED: Get user profile details safely

  // ✅ FIXED: Robust fallback filter checking both id and slug against string array keys
  const savedAttractions = useMemo(() => {
    return attractions.filter((a) => 
      favoriteIds.includes(String(a.id)) || 
      favoriteIds.includes(String(a.slug))
    )
  }, [attractions, favoriteIds])

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* 🌌 UNIFIED OBSIDIAN BRAND HEADER (Matches Home exactly) */}
      <header className="w-full shrink-0 bg-[#0B1528] px-6 py-5 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 font-medium tracking-wider">Ayubowan LK</p>
          <h1 className="text-xl font-extrabold tracking-tight mt-0.5">
            {user?.name ?? 'Hiruni Imasha'} ✨
          </h1>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            📍 Favorites Collection
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto">
          <div className="relative">
            <input 
              placeholder="Search saved destinations..." 
              className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-emerald-500/50 pl-4" 
            />
          </div>
        </div>
      </header>

      {/* 📜 SCROLLABLE CONTENT AREA (Identical Page Margins) */}
      <div className="flex-1 overflow-y-auto pb-28 px-6 no-scrollbar">
        <h2 className="text-lg font-black text-slate-800 mb-4 tracking-tight mt-6">
          Saved Destinations ({savedAttractions.length})
        </h2>

        {savedAttractions.length === 0 ? (
          /* 🌟 PREMIUM UX EMPTY STATE */
          <div className="flex flex-col items-center justify-center w-full h-[50vh] text-center gap-4">
            <div className="text-slate-400 font-medium text-sm">
              No saved destinations yet. Your collection is empty!
            </div>
            <button 
              onClick={() => navigate('/')} 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold active:scale-95 transition-all text-xs shadow-md cursor-pointer min-h-48px"
            >
              Explore Places
            </button>
          </div>
        ) : (
          /* 🗺️ CARDS GRID MATRIX */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {savedAttractions.map((attraction) => {
              const targetId = attraction.slug || attraction.id
              return (
                <div 
                  key={attraction.id} 
                  className="rounded-[2rem] overflow-hidden border border-slate-100 bg-white shadow-sm relative h-280px group cursor-pointer" 
                  onClick={() => navigate(`/attraction/${targetId}`)}
                >
                  <img 
                    src={attraction.image} 
                    alt={attraction.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to from-slate-950/90 via-slate-900/20 to-transparent z-10" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <div className="bg-amber-500 text-slate-950 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded w-max">
                      {attraction.category}
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1.5 leading-tight line-clamp-2">
                      {attraction.name}
                    </h3>
                    
                    <div className="flex justify-between items-center mt-2 w-full">
                      <div className="text-slate-300 text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {attraction.category === 'Hotels' ? 'Premium Resort' : 'Sri Lanka'}
                      </div>
                      
                      {/* HEART TOGGLE BUTTON */}
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation()
                          toggleFavorite(targetId) 
                        }} 
                        className="bg-white/90 text-emerald-600 p-2.5 rounded-full shadow hover:bg-white active:scale-90 transition-all min-h-40px min-w-40px flex items-center justify-center cursor-pointer"
                      >
                        <Heart className={`h-4 w-4 ${isFavorite(targetId) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 📱 STICKY FOOTER NAVIGATION */}
      <BottomNav />
    </div>
  )
}