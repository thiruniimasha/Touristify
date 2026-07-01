import { Compass, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SRI_LANKA_MOBILE_PATTERN = /^07[0-9]{8}$/

export default function Onboarding() {
  const { completeOnboarding } = useUser()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [errors, setErrors] = useState({ name: '', contact: '' })

  function validateForm() {
    const trimmedName = name.trim()
    const trimmedContact = contact.trim()
    const nextErrors = { name: '', contact: '' }

    if (trimmedName.length === 0) {
      nextErrors.name = 'Please enter your name.'
    } else if (trimmedName.length < 3) {
      nextErrors.name = 'Name must be at least 3 characters.'
    }

    if (
      trimmedContact.length === 0 ||
      (!EMAIL_PATTERN.test(trimmedContact) && !SRI_LANKA_MOBILE_PATTERN.test(trimmedContact))
    ) {
      nextErrors.contact = 'Please enter a valid email or a 10-digit Sri Lankan mobile number starting with 07'
    }

    setErrors(nextErrors)
    return !nextErrors.name && !nextErrors.contact
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    completeOnboarding(name, contact.trim())
    navigate('/')
  }

  return (
    <div className="min-h-screen w-screen bg-[#0B1528] lg:bg-slate-50 flex flex-col lg:grid lg:grid-cols-2 font-sans antialiased overflow-x-hidden p-0 m-0">
      <section className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to from-emerald-600 via-[#0B1528] to-slate-950 text-white relative overflow-hidden h-full">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left--2rem top-10 h-48 w-48 rounded-full border border-white/40" />
          <div className="absolute right-8 top-24 h-64 w-64 rounded-full border border-white/20" />
          <div className="absolute bottom--3rem left-1/3 h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute inset-0 bg-radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_40%)" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Compass size={24} strokeWidth={2.2} aria-hidden />
          </div>
          <div>
            <p className="text-lg font-black tracking-wider uppercase">Touristify LK</p>
            <p className="text-sm text-emerald-50/90">Travel smarter in Sri Lanka</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">Welcome aboard</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight leading-none">Discover the Pearl of the Indian Ocean.</h1>
          <p className="mt-5 text-base leading-7 text-emerald-50/90">
            Plan your next escape with live-inspired guidance, curated routes, and district-aware recommendations built for smooth Sri Lankan travel.
          </p>
        </div>

        <div className="relative z-10 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
          <p className="text-sm font-semibold">Personalized discovery</p>
          <p className="mt-1 text-sm text-emerald-50/90">Save your favorite places and get a tailored journey from the moment you arrive.</p>
        </div>
      </section>

      <section className="flex flex-col w-full min-h-screen lg:min-h-full bg-[#0B1528] lg:bg-slate-50">
        <div className="lg:hidden w-full m-0 p-8 pt-12 bg-gradient-to from-emerald-500 to-emerald-600 text-white rounded-b-[3rem] flex flex-col gap-3 shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Compass size={24} strokeWidth={2.2} aria-hidden />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Welcome to Touristify</h2>
            <p className="mt-1 text-sm text-emerald-50/90">Discover Sri Lanka through elegant local guidance.</p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto px-6 py-8 flex flex-col h-full lg:bg-white lg:border lg:border-slate-100 lg:rounded-[2.5rem] lg:p-10 lg:shadow-[0_20px_50px_rgba(0,0,0,0.03)] lg:mt-12">
          <div className="mb-8">
            <p className="text-xs font-black tracking-widest text-emerald-400 lg:text-emerald-500 uppercase mb-2">Let&apos;s begin</p>
            <h2 className="text-2xl font-black text-white lg:text-slate-900 tracking-tight leading-tight mb-2">Create your travel profile</h2>
            <p className="text-sm font-medium text-slate-300 lg:text-slate-500 mb-8 leading-relaxed">
              Enter your name and contact so Touristify can tailor your route and saved experiences.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div>
              <label htmlFor="onboarding-name" className="text-xs font-bold text-slate-200 lg:text-slate-700 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                <User size={16} strokeWidth={2} className="text-emerald-400 lg:text-emerald-600" />
                Your Name
              </label>
              <input
                id="onboarding-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Imasha"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/40 lg:bg-slate-50 lg:border-slate-200 text-white lg:text-slate-800 py-3.5 px-4 text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all min-h-48px"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="onboarding-contact" className="text-xs font-bold text-slate-200 lg:text-slate-700 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                <Mail size={16} strokeWidth={2} className="text-emerald-400 lg:text-emerald-600" />
                Email / Mobile Number
              </label>
              <input
                id="onboarding-contact"
                type="text"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="e.g. example@mail.com or 0712345678"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/40 lg:bg-slate-50 lg:border-slate-200 text-white lg:text-slate-800 py-3.5 px-4 text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all min-h-48px"
                aria-invalid={Boolean(errors.contact)}
                aria-describedby={errors.contact ? 'contact-error' : undefined}
              />
              {errors.contact && (
                <p id="contact-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {errors.contact}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] text-sm min-h-48px flex items-center justify-center cursor-pointer font-sans"
            >
              Start Exploring
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
