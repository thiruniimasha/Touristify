import { useMemo, useState } from 'react'
import {
  clearStoredUser,
  readStoredUser,
  saveStoredUser,
} from '../utils/userStorage'
import { UserContext } from './userContext'

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  function completeOnboarding(name, contact) {
    const profile = { name: name.trim(), contact: contact.trim() }
    saveStoredUser(profile)
    setUser(profile)
  }

  function logout() {
    clearStoredUser()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      completeOnboarding,
      logout,
    }),
    [user],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
