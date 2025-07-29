import { toggleFavorite, SourceType } from "./reducers/userFavoritesSlice";
import type { AppDispatch } from "./store";

export function handleToggleFavorite({
  item,
  dispatch,
  source,
}: {
  item: {
    url: string;
    title?: string;
    description?: string;
    urlToImage?: string;
  };
  dispatch: AppDispatch;
  source: SourceType;
}) {
  if (!item || !item.url) {
    console.warn("Invalid item passed to handleToggleFavorite:", item);
    return;
  }

  dispatch(
    toggleFavorite({
      id: item.url,
      title: item.title || "",
      imageUrl: item.urlToImage || "",
      description: item.description || "",
      url: item.url,
      source,
    })
  );
}
