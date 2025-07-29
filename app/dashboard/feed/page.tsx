"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { useGetTopHeadlinesQuery } from "@/lib/services/newsApi";
import { Loader } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { selectFavoriteIds } from "@/lib/reducers/userFavoritesSlice";
import { handleToggleFavorite } from "@/lib";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion } from "framer-motion";

import { useTranslation } from "react-i18next";

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
}

export default function PersonalizedFeed() {
  const userId = useAppSelector((s) => s.user.id);
  const preferences = useAppSelector((s) =>
    userId ? s.user.profile[userId]?.preferences : []
  ) as string[] | undefined;

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [articles, setArticles] = useState<Article[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const shouldSkip = !userId || !preferences || preferences.length === 0;

  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const favSet = new Set(favoriteIds);
  const { t } = useTranslation();

  useEffect(() => {
    setPage(1);
    setArticles([]);
  }, [debouncedQuery]);

  const { data, isLoading, isFetching, error } = useGetTopHeadlinesQuery(
    { categories: preferences ?? [], page, query: debouncedQuery },
    { skip: shouldSkip }
  );

  useEffect(() => {
    if (!data?.articles?.length) return;

    setArticles((prev) => {
      const existingUrls = new Set(prev.map((a) => a.url));
      const newArticles = data.articles.filter(
        (a) => a && a.url && !existingUrls.has(a.url)
      );
      return [...prev, ...newArticles];
    });
  }, [data, page]);

  const totalResults = data?.totalResults ?? Infinity;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      const hasMore = articles.length < totalResults;

      if (entry.isIntersecting && !isFetching && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [isFetching, isLoading, articles.length, totalResults]
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(articles);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    console.log(reordered);
    setArticles(reordered);
  };

  if (!userId) return null;
  if (error)
    return (
      <p className="text-red-500 text-center">
        {t("Failed to load personalized feed.")}
      </p>
    );

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      {isLoading && !articles.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="feed">
            {(provided) => (
              <div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {articles.map((item, index) => {
                  if (!item || !item.url) return null;
                  return (
                    <Draggable
                      key={item.url}
                      draggableId={item.url}
                      index={index}
                      isDragDisabled={false}
                    >
                      {(dragProvided, snapshot) => (
                        <motion.div
                          className="h-full flex flex-col "
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          initial={false}
                          animate={{ scale: snapshot.isDragging ? 1.05 : 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          layout
                          style={{
                            ...dragProvided.draggableProps.style,
                            zIndex: snapshot.isDragging ? 1000 : "auto",
                          }}
                        >
                          <ContentCard
                            id={item.url}
                            title={item.title || "No title"}
                            description={item.description || ""}
                            imageUrl={item.urlToImage || ""}
                            url={item.url}
                            source="news"
                            isFavorite={favSet.has(item.url)}
                            onToggleFavorite={() =>
                              handleToggleFavorite({
                                item,
                                dispatch,
                                source: "news",
                              })
                            }
                          />
                        </motion.div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div ref={observerRef} className="flex justify-center text-center py-4">
        {isFetching && <Loader className="animate-spin" />}
        {!isFetching && articles.length >= totalResults && (
          <p className="text-sm text-gray-400">You’ve reached the end.</p>
        )}
      </div>
    </section>
  );
}
