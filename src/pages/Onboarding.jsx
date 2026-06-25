import { Compass, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SRI_LANKA_MOBILE_PATTERN = /^07[0-9]{8}$/

export default function Onboarding() {
  const { completeOnboarding } = useUser()
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
      (!EMAIL_PATTERN.test(trimmedContact) &&
        !SRI_LANKA_MOBILE_PATTERN.test(trimmedContact))
    ) {
      nextErrors.contact =
        'Please enter a valid email or a 10-digit Sri Lankan mobile number starting with 07'
    }

    setErrors(nextErrors)
    return !nextErrors.name && !nextErrors.contact
  }

  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    completeOnboarding(name, contact.trim())
    navigate('/')
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col bg-slate-50">
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-6 pb-16 pt-12 text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Compass size={26} strokeWidth={2} aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Welcome to Touristify
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-emerald-50">
          Your pocket guide to discovering Sri Lanka. Tell us a little about
          yourself to personalize your journey.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative -mt-8 flex flex-1 flex-col rounded-t-3xl bg-white px-6 pb-8 pt-8 shadow-[0_-8px_30px_rgba(15,23,42,0.08)]"
        noValidate
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="onboarding-name"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"
            >
              <User size={16} strokeWidth={2} className="text-emerald-600" />
              Your Name
            </label>
            <input
              id="onboarding-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Imasha"
              autoComplete="name"
              className={[
                'min-h-12 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400',
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ].join(' ')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="onboarding-contact"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"
            >
              <Mail size={16} strokeWidth={2} className="text-emerald-600" />
              Email Address or Mobile Number
            </label>
            <input
              id="onboarding-contact"
              type="text"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="e.g. example@mail.com or 0712345678"
              autoComplete="email"
              className={[
                'min-h-12 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400',
                errors.contact
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
              ].join(' ')}
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={errors.contact ? 'contact-error' : undefined}
            />
            {errors.contact && (
              <p id="contact-error" className="mt-1.5 text-xs text-red-600" role="alert">
                {errors.contact}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all active:scale-95 hover:bg-emerald-700"
        >
          Start Exploring
        </button>
      </form>
    </div>
  )
}
