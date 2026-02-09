/**
 * Simple cache utility for API responses
 * Reduces redundant API calls on page reload
 */

const CACHE_PREFIX = 'visit_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data if still valid
 */
export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const { data, timestamp, ttl } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > ttl) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

/**
 * Set cached data with TTL
 */
export const setCachedData = (key, data, ttl = DEFAULT_TTL) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

/**
 * Invalidate specific cache key
 */
export const invalidateCache = (key) => {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

/**
 * Invalidate all cache keys matching a pattern
 */
export const invalidateCachePattern = (pattern) => {
  try {
    const keys = Object.keys(localStorage).filter(
      key => key.startsWith(CACHE_PREFIX) && key.includes(pattern)
    );
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Cache pattern invalidation error:', error);
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};

/**
 * Fetch with cache - fetches from cache first, then API
 */
export const fetchWithCache = async (key, fetchFn, ttl = DEFAULT_TTL) => {
  // Try cache first
  const cached = getCachedData(key);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  // Fetch from API
  const data = await fetchFn();
  setCachedData(key, data, ttl);
  return { data, fromCache: false };
};
