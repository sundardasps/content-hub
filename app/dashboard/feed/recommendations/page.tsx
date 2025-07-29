"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect, useState, useRef, useCallback } from "react";
import { useGetMoviesByGenreQuery } from "@/lib/services/tmdbApi";
import { useSearchParams } from "next/navigation";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { Loader } from "lucide-react";
import { handleToggleFavorite } from "@/lib";
import { selectFavoriteIds } from "@/lib/reducers/userFavoritesSlice";
import { useDebounce } from "@/hooks/useDebounce";
interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export default function RecommendationFeed() {
  const userId = useAppSelector((s) => s.user.id);
  const preferences = useAppSelector((s) =>
    userId ? s.user.profile[userId]?.moviePreferences : []
  ) as number[] | undefined;

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const shouldSkip = !userId || !preferences || preferences.length === 0;
  const dispatch = useAppDispatch();

  const favoriteIds = useAppSelector(selectFavoriteIds);
  const favSet = new Set(favoriteIds);


  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [debouncedQuery]);

  const { data, isLoading, isFetching, error } = useGetMoviesByGenreQuery(
    { categories: preferences ?? [], page, query: debouncedQuery },
    { skip: shouldSkip }
  );

  useEffect(() => {
    if (!data?.results?.length) return;
    setMovies((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newMovies = data.results.filter((m) => !existingIds.has(m.id));
      if (page === 1) return newMovies;
      return [...prev, ...newMovies];
    });
  }, [data, page, debouncedQuery]);

  const totalPages = data?.total_pages ?? Infinity;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      const hasMore = page < totalPages;

      if (entry.isIntersecting && !isLoading && !isFetching && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [isLoading, isFetching, page, totalPages]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0.5,
    });

    const target = observerRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [handleObserver]);

  if (!userId) return null;
  if (error)
    return (
      <p className="text-center text-red-500">
        Failed to load recommendations.
      </p>
    );

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      {isLoading && !movies.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {movies.map((item) => (
            <ContentCard
              key={item.id}
              id={item.id.toString()}
              title={item.title}
              description={item.overview}
              imageUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              url={`https://www.themoviedb.org/movie/${item.id}`}
              source="tmdb"
              isFavorite={favSet.has(
                `https://www.themoviedb.org/movie/${item.id}`
              )}
              onToggleFavorite={() =>
                handleToggleFavorite({
                  item: {
                    url: `https://www.themoviedb.org/movie/${item.id}`,
                    description: item.overview,
                    title: item.title,
                    urlToImage: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  },
                  dispatch,
                  source: "tmdb",
                })
              }
            />
          ))}
        </div>
      )}

      <div ref={observerRef} className="flex justify-center py-4">
        {isFetching && <Loader className="animate-spin" />}
        {!isFetching && page >= totalPages && (
          <p className="text-sm text-gray-400">You’ve reached the end.</p>
        )}
      </div>
    </section>
  );
}
