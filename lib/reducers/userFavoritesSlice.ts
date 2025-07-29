// reducers/userFavoritesSlice.ts
import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type SourceType = "news" | "tmdb" | "spotify" | "social";

export interface FavoriteItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  url: string;
  source: SourceType;
  createdAt: number;
}

const favoritesAdapter = createEntityAdapter<FavoriteItem>({
  selectId: (item) => item.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

export const initialState = favoritesAdapter.getInitialState();


const userFavoritesSlice = createSlice({
  name: "userFavorites",
  initialState,
  reducers: {
    addFavorite: {
      reducer: (state, action: PayloadAction<FavoriteItem>) => {
        favoritesAdapter.addOne(state, action.payload);
      },
      prepare: (item: Omit<FavoriteItem, "createdAt">) => ({
        payload: { ...item, createdAt: Date.now() },
      }),
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      favoritesAdapter.removeOne(state, action.payload);
    },
    toggleFavorite: {
      reducer: (state, action: PayloadAction<FavoriteItem>) => {
        const { id } = action.payload;
console.log("🧪 state inside reducer:", JSON.stringify(state, null, 2));

        if (!state.ids.includes(id)) {
          console.log("[+] Adding favorite:", id);
          favoritesAdapter.addOne(state, action.payload);
        } else {
          console.log("[-] Removing favorite:", id);
          favoritesAdapter.removeOne(state, id);
        }

        // Debug: force log shape
        console.log("state.ids:", state.ids);
        console.log("state.entities:", JSON.stringify(state.entities));
      },
      prepare: (item: Omit<FavoriteItem, "createdAt">) => ({
        payload: { ...item, createdAt: Date.now() },
      }),
    },
    clearFavorites: (state) => {
      favoritesAdapter.removeAll(state);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  userFavoritesSlice.actions;

export default userFavoritesSlice.reducer;

export const selectFavoritesState = (state: RootState) => state.userFavorites;

export const {
  selectAll: selectAllFavorites,
  selectById: selectFavoriteById,
  selectIds: selectFavoriteIds,
} = favoritesAdapter.getSelectors<RootState>((state) => state.userFavorites);

// Handy helper if you just want to know if something is favorited:
export const selectIsFavorite = (id: string) => (state: RootState) =>
  Boolean(state.userFavorites.entities[id]);
