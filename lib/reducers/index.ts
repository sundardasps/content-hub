
import { combineReducers } from "redux";
import userReducer from "./userSlice";
import userFavoritesReducer from "./userFavoritesSlice";

import { newsApi } from "../services/newsApi";
import { tmdbApi } from "../services/tmdbApi";
import { socialApi } from "../services/socialApi";

const rootReducer = combineReducers({
  user: userReducer,
  userFavorites: userFavoritesReducer,
  [newsApi.reducerPath]: newsApi.reducer,
  [tmdbApi.reducerPath]: tmdbApi.reducer,
  [socialApi.reducerPath]: socialApi.reducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
