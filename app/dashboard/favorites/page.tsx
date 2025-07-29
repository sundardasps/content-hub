"use client";

import ContentCard from "@/components/ContentCard";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { selectAllFavorites } from "@/lib/reducers/userFavoritesSlice";
import { handleToggleFavorite } from "@/lib";
import { useIsHydrated } from "@/hooks/useIsHydrated";


export default function FavoritesSection() {
  const hydrated = useIsHydrated();
  const favorites = useAppSelector(selectAllFavorites);
  const dispatch = useAppDispatch();

  if (!hydrated) return null;

  if (!favorites.length) {
    return (
      <p className="text-center text-gray-500">You have no favorites yet.</p>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Your Favorites</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav) => (
          <ContentCard
            key={fav.id}
            id={fav.id}
            title={fav.title}
            description={fav.description}
            imageUrl={fav.imageUrl}
            url={fav.url}
            source={fav.source}
            isFavorite
            onToggleFavorite={() => {
              handleToggleFavorite({
                item: fav,
                dispatch,
                source: fav.source,
              });
            }}
          />
        ))}
      </div>
    </section>
  );
}
