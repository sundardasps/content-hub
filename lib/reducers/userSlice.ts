


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id?: string;
  email?: string;
  image?: string;
  profile: {
    [userId: string]: {
      name: string;
      preferences: string[];        // News categories
      moviePreferences: number[];   // TMDB genres
      journeyComplete: boolean;
    };
  };
}

export const initialState: UserState = {
  profile: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{ id: string; email: string; image?: string }>
    ) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.image = action.payload.image;
    },

    clearUser(state) {
      state.id = undefined;
      state.email = undefined;
      state.image = undefined;
      // Note: profile is preserved
    },

    updateProfile(
      state,
      action: PayloadAction<{
        userId: string;
        profile: {
          name: string;
          preferences: string[];
          moviePreferences: number[];
          journeyComplete: boolean;
        };
      }>
    ) {
      state.profile[action.payload.userId] = action.payload.profile;
    },
  },
});

export const { setUser, clearUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;
