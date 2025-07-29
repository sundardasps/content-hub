"use client";

import { useState } from "react";
import { NEWS_CATEGORIES, MOVIE_GENRES } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { updateProfile } from "@/lib/reducers/userSlice";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/ThemeContext";

export default function PreferencesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { id: userId, profile } = useAppSelector((state) => state.user);
  const currentProfile = userId ? profile[userId] : null;
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [name, setName] = useState(currentProfile?.name || "");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    currentProfile?.preferences || []
  );
  const [selectedMovieGenres, setSelectedMovieGenres] = useState<number[]>(
    currentProfile?.moviePreferences || []
  );

  const handlePreferenceToggle = (category: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleMovieToggle = (id: number) => {
    setSelectedMovieGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!userId) return;

    dispatch(
      updateProfile({
        userId,
        profile: {
          ...currentProfile,
          name,
          preferences: selectedPreferences,
          moviePreferences: selectedMovieGenres,
        },
      })
    );

    onClose();
  };
  const isDark = theme === "dark";
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-end z-50 w-screen  backdrop-blur-xs   `}
    >
      <div
        className={`max-w-md h-full overflow-y-auto  p-6 space-y-6 shadow-xl  ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-black "
        }`}
      >
        <h2 className="text-2xl font-bold">{t("Edit Preferences")}</h2>

        <div>
          <label className="block text-sm mb-1">{t("Your Name")}</label>
          <input
            className={`w-full px-3 py-2 ${
              isDark ? "bg-gray-500 text-white" : "bg-gray-200 text-black "
            } rounded`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-2">{t("News Preferences")}</label>
          <div className="flex flex-wrap gap-2">
            {NEWS_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handlePreferenceToggle(category)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  selectedPreferences.includes(category)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-zinc-700 text-gray-300 border-zinc-600 hover:bg-zinc-600"
                }`}
              >
                {t(category)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">{t("Movie Preferences")}</label>
          <div className="flex flex-wrap gap-2">
            {MOVIE_GENRES.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleMovieToggle(genre.id)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  selectedMovieGenres.includes(genre.id)
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-zinc-700 text-gray-300 border-zinc-600 hover:bg-zinc-600"
                }`}
              >
                {t(genre.name)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="text-gray-500 hover:underline">
            {t("Cancel")}
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
            disabled={
              !name ||
              selectedPreferences.length === 0 ||
              selectedMovieGenres.length === 0
            }
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
