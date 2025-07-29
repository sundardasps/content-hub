"use client";

import React from "react";
import ContentCard from "@/components/ContentCard";
import { useGetTrendingNewsQuery } from "@/lib/services/newsApi";
import { useGetTrendingMoviesQuery } from "@/lib/services/tmdbApi";
import { useTheme } from "@/hooks/ThemeContext";
import { handleToggleFavorite } from "@/lib";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { selectFavoriteIds } from "@/lib/reducers/userFavoritesSlice";
import { useTranslation } from "react-i18next";

type TrendType = "news" | "movies";

const NEWS_CATEGORIES = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

export default function TrendingSection() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [type, setType] = React.useState<TrendType>("news");
  const [newsCategory, setNewsCategory] = React.useState("general");
  const [page] = React.useState(1);

  const favoriteIds = useAppSelector(selectFavoriteIds);
  const favSet = new Set(favoriteIds);

  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
  } = useGetTrendingNewsQuery(
    { category: newsCategory, page },
    { skip: type !== "news" }
  );

  const {
    data: movieData,
    isLoading: moviesLoading,
    error: moviesError,
  } = useGetTrendingMoviesQuery({ page }, { skip: type !== "movies" });

  const selectClass =
    "px-2 py-1 rounded border text-sm focus:outline-none focus:ring-2 transition" +
    (theme === "dark"
      ? " bg-gray-800 text-white border-gray-600 focus:ring-blue-500"
      : " bg-white text-gray-800 border-gray-300 focus:ring-blue-400");

  const renderBody = () => {
    if (type === "news") {
      if (newsLoading) return <p>{t("Loading trending news")}</p>;
      if (newsError) return <p>{t("Failed to load trending news")}</p>;

      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newsData?.articles?.slice(0, 6).map((a) => (
            <ContentCard
              key={a.url}
              id={a.url}
              title={a.title}
              description={a.description}
              imageUrl={a.urlToImage}
              url={a.url}
              source="news"
              isFavorite={favSet.has(a.url)}
              onToggleFavorite={() =>
                handleToggleFavorite({ item: a, dispatch, source: "news" })
              }
            />
          ))}
        </div>
      );
    }

    if (type === "movies") {
      if (moviesLoading) return <p>{t("Loading trending movies")}</p>;
      if (moviesError) return <p>{t("Failed to load trending movies")}</p>;

      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {movieData?.results?.slice(0, 6).map((m) => (
            <ContentCard
              key={m.id}
              id={m.id.toString()}
              title={m.title}
              description={m.overview}
              imageUrl={
                m.poster_path
                  ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                  : undefined
              }
              url={`https://www.themoviedb.org/movie/${m.id}`}
              source="tmdb"
              isFavorite={favSet.has(
                `https://www.themoviedb.org/movie/${m.id}`
              )}
              onToggleFavorite={() =>
                handleToggleFavorite({
                  item: {
                    url: `https://www.themoviedb.org/movie/${m.id}`,
                    description: m.overview,
                    title: m.title,
                    urlToImage: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                  },
                  dispatch,
                  source: "tmdb",
                })
              }
            />
          ))}
        </div>
      );
    }

    return (
      <div className="p-4 rounded-lg border text-sm text-gray-500">
        {t("Trending posts coming soon…")}
      </div>
    );
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold">{t("Trending Section Title")}</h2>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className={selectClass}
            value={type}
            onChange={(e) => setType(e.target.value as TrendType)}
          >
            <option value="news">{t("Trending News")}</option>
            <option value="movies">{t("Trending Movies")}</option>
          </select>

          {type === "news" && (
            <select
              className={selectClass}
              value={newsCategory}
              onChange={(e) => setNewsCategory(e.target.value)}
              aria-label={t("Select News Category")}
            >
              {NEWS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(c[0].toUpperCase() + c.slice(1))}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {renderBody()}
    </section>
  );
}
