"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/hooks/ThemeContext";
import React from "react";

interface ContentCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  url: string;
  source: "news" | "tmdb" | "spotify" | "social";
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const ContentCard = React.memo(function ContentCard({
  id,
  title,
  description,
  imageUrl,
  url,
  source,
  isFavorite = false,
  onToggleFavorite,
}: ContentCardProps) {
  const { theme } = useTheme();

  const handleFavoriteToggle = () => {
    if (onToggleFavorite) onToggleFavorite(id);
  };

  const platformLabel = {
    news: "News",
    tmdb: "Movie",
    spotify: "Music",
    social: "Social",
  }[source];

  const isDark = theme === "dark";

  return (
    <motion.div
      className={`${
        isDark ? "bg-gray-900 text-white" : "bg-white text-black "
      } h-full rounded-2xl shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col justify-between group relative`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      {imageUrl && (
        <div className="w-full h-48 relative rounded-lg overflow-hidden mb-3">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized
          />
        </div>
      )}

      <div className="flex-1">
        <span
          className={`text-xs font-semibold uppercase  ${
            isDark ? " text-gray-500" : " text-black "
          }`}
        >
          {platformLabel}
        </span>

        <h3
          className={`font-semibold mt-1   line-clamp-2 ${
            isDark ? " text-zinc-100" : " text-zinc-800 "
          }`}
        >
          {title}
        </h3>

        {description && (
          <p
            className={`text-sm mt-2  line-clamp-3 flex-grow ${
              isDark ? " text-gray-300" : " text-gray-600 "
            }`}
          >
            {description}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:underline"
        >
          <ExternalLink size={14} />
          {source === "news"
            ? "Read More"
            : source === "spotify"
            ? "Play Now"
            : "Open"}
        </a>

        <button
          onClick={handleFavoriteToggle}
          className="text-gray-500 hover:text-yellow-500 transition"
          title="Toggle Favorite"
        >
          {isFavorite ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>
    </motion.div>
  );
});

export default ContentCard;
