import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { newsApi } from "../services/newsApi";
import { tmdbApi } from "../services/tmdbApi";
import { socialApi } from "../services/socialApi";
import { initialState as userFavoritesInitialState } from "../reducers/userFavoritesSlice";
import {initialState as userInitialState }  from "../reducers/userSlice";


const initialRootState = {
  user: userInitialState, // example, import your actual initial state
  userFavorites: userFavoritesInitialState,

};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "userFavorites"],
  // migrate: async (state) => {
  //   if (
  //     !state?.userFavorites ||
  //     typeof state.userFavorites !== "object" ||
  //     !Array.isArray(state.userFavorites.ids) ||
  //     typeof state.userFavorites.entities !== "object"
  //   ) {
  //     console.warn("🧹 Cleaning up bad userFavorites state");
  //     state.userFavorites = userFavoritesInitialState;
  //   }
  //   return state;
  // },
  migrate: async (state) => {
    if (!state || typeof state !== "object") {
      // state is undefined or bad shape, replace with initial root state
      console.warn("🧹 Replacing undefined or invalid persisted state with initialRootState");
      return initialRootState;
    }

    // Defensive check for userFavorites slice
    if (
      !state.userFavorites ||
      typeof state.userFavorites !== "object" ||
      !Array.isArray(state.userFavorites.ids) ||
      typeof state.userFavorites.entities !== "object"
    ) {
      console.warn("🧹 Cleaning up bad userFavorites state");
      // Instead of mutating state directly, create a new object to be returned
      return {
        ...state,
        userFavorites: userFavoritesInitialState,
      };
    }

    return state;
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(newsApi.middleware, tmdbApi.middleware, socialApi.middleware),
  });

export const store = makeStore();
export const persistor = persistStore(store);

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

// Hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
