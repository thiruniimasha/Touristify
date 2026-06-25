import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export function useUser() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useUser must be used within an AppProvider')
  }

  return {
    user: context.user,
    completeOnboarding: context.completeOnboarding,
    logout: context.logout,
    simulatedDistrict: context.simulatedDistrict,
    setSimulatedDistrict: context.setSimulatedDistrict,
  }
}
