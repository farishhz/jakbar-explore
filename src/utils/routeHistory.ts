const STORAGE_KEY = 'routeHistory'
const MAX_HISTORY = 5

export interface SavedRoute {
  transport: 'transjakarta' | 'krl'
  origin: string
  routeId: string
  label: string
  timestamp: number
}

/**
 * Get all saved routes from localStorage
 * Safe for SSR - checks typeof window before accessing localStorage
 */
export function getRouteHistory(): SavedRoute[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to read route history:', error)
    return []
  }
}

/**
 * Save a new route to history
 * Prevents duplicates: removes any existing route with same transport/origin/routeId
 * Keeps max 5 entries, removing oldest ones first
 */
export function saveRoute(route: Omit<SavedRoute, 'timestamp'>): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const history = getRouteHistory()
    
    // Remove duplicate if it exists
    const filtered = history.filter(
      h => !(h.transport === route.transport && h.origin === route.origin && h.routeId === route.routeId)
    )
    
    // Add new route with timestamp
    const newRoute: SavedRoute = {
      ...route,
      timestamp: Date.now()
    }
    
    // Keep only the latest MAX_HISTORY entries (newest first)
    const updated = [newRoute, ...filtered].slice(0, MAX_HISTORY)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save route history:', error)
  }
}

/**
 * Get the most recently saved route
 */
export function getLastRoute(): SavedRoute | null {
  const history = getRouteHistory()
  return history.length > 0 ? history[0] : null
}

/**
 * Clear all route history
 */
export function clearRouteHistory(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear route history:', error)
  }
}
