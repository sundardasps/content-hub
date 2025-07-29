import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
}

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getMoviesByGenre: builder.query<
      TMDBResponse,
      { categories: number[]; page?: number; query?: string }
    >({
      query: ({ categories, page = 1, query }) => {
        const genreParam = categories.join(",");
        const queryParam = query ? `&query=${encodeURIComponent(query)}` : "";
        return `/tmdb?categories=${genreParam}&page=${page}${queryParam}`;
      },
    }),
    getTrendingMovies: builder.query<TMDBResponse, { page?: number }>({
      query: ({ page = 1 } = {}) => `/tmdb/trending?page=${page}`,
    }),
  }),
});

export const {
  useGetMoviesByGenreQuery,
  useGetTrendingMoviesQuery,
} = tmdbApi;
