import { API_ATTRACTIONS_URL, API_DISTRICTS_URL } from '../utils/constants'

export async function fetchAttractions() {
  const response = await fetch(API_ATTRACTIONS_URL)

  if (!response.ok) {
    throw new Error(
      `Unable to load destinations. Server responded with status ${response.status}.`,
    )
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Invalid attractions data format received from the API.')
  }

  return data
}

export async function fetchDistricts() {
  const response = await fetch(API_DISTRICTS_URL)

  if (!response.ok) {
    throw new Error(
      `Unable to load district list. Server responded with status ${response.status}.`,
    )
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Invalid district data format received from the API.')
  }

  return data
}

export async function fetchAttractionBySlug(slug) {
  const attractions = await fetchAttractions()
  const attraction = attractions.find((item) => item.slug === slug)

  if (!attraction) {
    throw new Error('Attraction not found.')
  }

  return attraction
}
