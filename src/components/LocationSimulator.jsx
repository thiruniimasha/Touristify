import { ChevronDown, MapPin, Navigation } from 'lucide-react'

export default function LocationSimulator({ simulatedDistrict, onDistrictChange, districtOptions }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/10">
            <Navigation className="h-5 w-5 text-emerald-600" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Simulate your location</p>
            <p className="text-xs text-slate-500">
              Distances recalculate from{' '}
              <span className="font-semibold text-emerald-600">{simulatedDistrict}</span> across all available districts.
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
          <select
            value={simulatedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            aria-label="Simulate location district"
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-9 text-sm font-medium text-slate-800 transition-colors focus:border-emerald-400 focus:outline-none"
          >
            {['Real GPS', ...districtOptions].map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
    </div>
  )
}
