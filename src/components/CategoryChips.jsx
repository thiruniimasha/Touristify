import { CATEGORIES } from '../utils/constants'

export function CategoryChips({ active, onChange }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 scrollbar-hide">
      <div className="flex w-max gap-2 pb-1">
        {CATEGORIES.map((category) => {
          const isActive = active === category.value
          return (
            <button
              key={category.value}
              type="button"
              onClick={() => onChange(category.value)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              <span className="text-base leading-none">{category.emoji}</span>
              {category.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
