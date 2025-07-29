// Theme options
export const THEME_OPTIONS = ['light', 'dark'] as const;

// NewsAPI categories
export const NEWS_CATEGORIES = [
  'technology',
  'business',
  'sports',
  'entertainment',
  'health',
  'science',
  'general',
] as const;

// Spotify genres (can be mocked if API not used)
export const MUSIC_GENRES = [
  'pop',
  'hip hop',
  'rock',
  'jazz',
  'classical',
  'edm',
] as const;

// TMDB movie genres (IDs for API if needed)
export const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 16, name: 'Animation' },
] as const;

// Supported social platforms
export const SOCIAL_PLATFORMS = ['twitter', 'instagram'] as const;
