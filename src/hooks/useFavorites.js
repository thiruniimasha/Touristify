import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export function useFavorites() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useFavorites must be used within an AppProvider')
  }

  return {
    favoriteIds: context.favorites,
    isFavorite: context.isFavorite,
    toggleFavorite: context.toggleFavorite,
    removeFavorite: context.removeFavorite,
  }
}
