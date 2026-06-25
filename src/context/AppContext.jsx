import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { fetchAttractions, fetchDistricts } from '../services/attractionsApi'
import { haversineDistanceKm } from '../utils/haversine'
import { FAVORITES_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/constants'

const DISTANCE_MULTIPLIERS = {
  Historical: 1.22,
  Nature: 1.48,
  Hotels: 1.25,
  Beach: 1.25,
}

function readLocalUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed.name === 'string' &&
      typeof parsed.contact === 'string' &&
      parsed.name.trim().length >= 3 &&
      (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.contact.trim()) ||
        /^07[0-9]{8}$/.test(parsed.contact.trim()))
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

function saveLocalUser(user) {
  localStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify({
      name: user.name.trim(),
      contact: user.contact.trim(),
    }),
  )
}

function clearLocalUser() {
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(FAVORITES_STORAGE_KEY) // ✅ Clean favorites from storage too
}

function readLocalFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLocalFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
}

function getTerrainMultiplier(category) {
  return DISTANCE_MULTIPLIERS[category] ?? DISTANCE_MULTIPLIERS.Hotels
}

function getBrowserGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator || !navigator.geolocation) {
      reject(new Error('Geolocation unsupported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  })
}

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readLocalUser())
  const [simulatedDistrict, setSimulatedDistrict] = useState(null)
  const [favorites, setFavorites] = useState(() => readLocalFavorites())
  const [attractions, setAttractions] = useState([])
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deviceCoords, setDeviceCoords] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(true)

  const refreshAttractions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAttractions()
      setAttractions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load attractions.')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshDistricts = useCallback(async () => {
    try {
      const data = await fetchDistricts()
      setDistricts(data)
    } catch {
      setDistricts([])
    }
  }, [])

  useEffect(() => {
    refreshAttractions()
    refreshDistricts()
    
    let mounted = true
    setGpsLoading(true)
    getBrowserGeolocation()
      .then((coords) => {
        if (mounted) setDeviceCoords(coords)
      })
      .catch(() => {
        if (mounted) setDeviceCoords(null)
      })
      .finally(() => {
        if (mounted) setGpsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [refreshAttractions, refreshDistricts])

  useEffect(() => {
    // Only save if user is active to avoid re-creating empty arrays on logout
    if (localStorage.getItem(USER_STORAGE_KEY)) {
      saveLocalFavorites(favorites)
    }
  }, [favorites])

  const completeOnboarding = useCallback((name, contact) => {
    const profile = { name: name.trim(), contact: contact.trim() }
    saveLocalUser(profile)
    setUser(profile)
  }, [])

  // ✅ FIXED: Safe Logout sequence with window location fallback redirection
  const logout = useCallback(() => {
    clearLocalUser()
    setSimulatedDistrict(null)
    setFavorites([])
    setUser(null)
    
    // Explicitly push state window to root to trigger AppRouter onboarding route gate
    setTimeout(() => {
      window.location.href = '/'
    }, 50)
  }, [])

  const addFavorite = useCallback((id) => {
    setFavorites((current) =>
      current.includes(id) ? current : [...current, id],
    )
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites((current) => current.filter((favoriteId) => favoriteId !== id))
  }, [])

  const toggleFavorite = useCallback((id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    )
  }, [])

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites],
  )

  const getDistance = useCallback(
    async (targetLat, targetLng, category) => {
      try {
        const source = simulatedDistrict
          ? {
              latitude: Number(simulatedDistrict.latitude),
              longitude: Number(simulatedDistrict.longitude),
            }
          : deviceCoords
          ? {
              latitude: Number(deviceCoords.latitude),
              longitude: Number(deviceCoords.longitude),
            }
          : await getBrowserGeolocation()

        const distanceKm = haversineDistanceKm(
          source.latitude,
          source.longitude,
          Number(targetLat),
          Number(targetLng),
        )
        const multiplier = getTerrainMultiplier(category)
        const drivingDistance = distanceKm * multiplier
        return `${drivingDistance.toFixed(1)} km driving distance`
      } catch {
        return 'Distance unavailable'
      }
    },
    [simulatedDistrict, deviceCoords],
  )

  const value = useMemo(
    () => ({
      user,
      simulatedDistrict,
      deviceCoords,
      gpsLoading,
      favorites,
      attractions,
      districts,
      loading,
      error,
      refreshAttractions,
      completeOnboarding,
      logout,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      setSimulatedDistrict,
      getDistance,
    }),
    [
      user,
      simulatedDistrict,
      deviceCoords,
      gpsLoading,
      favorites,
      attractions,
      districts,
      loading,
      error,
      refreshAttractions,
      completeOnboarding,
      logout,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      setSimulatedDistrict,
      getDistance,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}