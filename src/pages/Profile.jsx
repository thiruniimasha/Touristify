import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { useUser } from '../hooks/useUser'
import { useFavorites } from '../hooks/useFavorites' // ✅ FIXED: Missing import added
import BottomNav from '../components/layout/BottomNav'

export default function Profile() {
  const navigate = useNavigate()
  const { districts = [], simulatedDistrict, setSimulatedDistrict } = useApp()
  const [selected, setSelected] = useState(simulatedDistrict ? simulatedDistrict.name : 'live')
  const { user, logout } = useUser()
  const { favoriteIds } = useFavorites()

  useEffect(() => {
    setSelected(simulatedDistrict ? simulatedDistrict.name : 'live')
  }, [simulatedDistrict])

  const handleSelect = (value) => {
    setSelected(value)
    if (value === 'live') {
      setSimulatedDistrict(null)
      return
    }

    const entry = districts.find((d) => (typeof d === 'string' ? d === value : d?.name === value || d?.district === value))
    if (entry && typeof entry !== 'string' && entry.latitude && entry.longitude) {
      setSimulatedDistrict({ 
        name: entry.name ?? entry.district ?? value, 
        latitude: Number(entry.latitude), 
        longitude: Number(entry.longitude) 
      })
      return
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* 🌌 UNIFIED OBSIDIAN BRAND HEADER (Matches Home.jsx exactly) */}
      <header className="w-full shrink-0 bg-[#0B1528] px-6 py-5 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 font-medium tracking-wider">Ayubowan LK</p>
         <h1 className="text-xl font-extrabold tracking-tight mt-0.5">{user?.name ?? 'Hiruni Imasha'} ✨</h1>
          <div className="text-xs text-slate-400 mt-1">⚙️ Profile &amp; Simulation Control</div>
        </div>
      </header>

      {/* 📜 SCROLLABLE CONTENT AREA (Identical Page Margins to Home) */}
      <div className="flex-1 overflow-y-auto pb-28 px-6 no-scrollbar">
        
        {/* PROFILE DASHBOARD CONTAINER */}
        <div className="max-w-2xl mx-auto w-full mt-8 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Location Simulation</h2>

          {/* DISTRICT SELECTOR */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Select Simulation District
            </label>
            <select
              value={selected}
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all min-h-48px"
            >
              <option value="live">🟢 Current Live Location (Default)</option>
              {Array.isArray(districts) && districts.length > 0 ? (
                districts.map((d) => (
                  <option 
                    key={typeof d === 'string' ? d : d?.name ?? d?.district} 
                    value={typeof d === 'string' ? d : d?.name ?? d?.district}
                  >
                    {typeof d === 'string' ? d : d?.name ?? d?.district}
                  </option>
                ))
              ) : (
                <option value="loading" disabled>
                  Loading districts...
                </option>
              )}
            </select>
            
            {/* DYNAMIC SUBTEXT BADGE */}
            <p className="mt-3 text-xs text-slate-500 font-medium flex items-center gap-1.5">
              {selected === 'live' ? (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  📍 Using your real-time device location (GPS)
                </>
              ) : (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  📍 Simulated route active from <span className="font-bold text-slate-700">{selected}</span>
                </>
              )}
            </p>
          </div>

          {/* DESTRUCTIVE TERMINAL RESET & LOGOUT BUTTON (Strict 48px Target) */}
          <button
            onClick={logout}
            className="w-full mt-8 bg-red-50 text-red-600 hover:bg-red-100/70 border border-red-200 font-bold py-3 px-4 rounded-2xl transition-all active:scale-95 text-sm min-h-48px flex items-center justify-center cursor-pointer"
          >
            Reset Profile &amp; Logout
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            This clears your profile data and returns you to onboarding.
          </p>
        </div>
        
      </div>

      {/* 📱 STICKY FOOTER NAVIGATION (Unified Responsive Component) */}
      <BottomNav />
    </div>
  )
}