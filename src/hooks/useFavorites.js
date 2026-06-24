import { useCallback, useEffect, useState } from 'react'
import { FAVORITES_STORAGE_KEY } from '../utils/constants'

function readStoredFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(readStoredFavorites)

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  const isFavorite = useCallback(
    (id) => favoriteIds.includes(id),
    [favoriteIds],
  )

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavoriteIds((prev) => prev.filter((item) => item !== id))
  }, [])

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  }
}
