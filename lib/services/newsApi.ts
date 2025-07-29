import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: { name: string };
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<
      NewsResponse,
      { categories: string[]; page?: number; query?: string }
    >({
      query: ({ categories, page = 1, query }) => {
        const catParam = categories.map(encodeURIComponent).join(",");
        const queryParam = query ? `&q=${encodeURIComponent(query)}` : "";
        return `/news?categories=${catParam}&page=${page}${queryParam}`;
      },
    }),
    getTrendingNews: builder.query<
      NewsResponse,
      { category?: string; page?: number }
    >({
      query: ({ category = "general", page = 1 }) =>
        `/news/trending?category=${encodeURIComponent(category)}&page=${page}`,
    }),
  }),
});

export const {
  useGetTopHeadlinesQuery,
  useGetTrendingNewsQuery, 
} = newsApi;
