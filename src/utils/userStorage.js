import { USER_STORAGE_KEY } from './constants'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SRI_LANKA_MOBILE_PATTERN = /^07[0-9]{8}$/

export function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    const validContact =
      typeof parsed.contact === 'string' &&
      (EMAIL_PATTERN.test(parsed.contact.trim()) ||
        SRI_LANKA_MOBILE_PATTERN.test(parsed.contact.trim()))

    if (
      parsed &&
      typeof parsed.name === 'string' &&
      parsed.name.trim().length >= 3 &&
      validContact
    ) {
      return {
        name: parsed.name.trim(),
        contact: parsed.contact.trim(),
      }
    }

    return null
  } catch {
    return null
  }
}

export function saveStoredUser(user) {
  localStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify({
      name: user.name.trim(),
      contact: user.contact.trim(),
    }),
  )
}

export function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY)
}
