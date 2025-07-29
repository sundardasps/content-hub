"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { updateProfile } from "@/lib/reducers/userSlice";
import { useRouter } from "next/navigation";
import { NEWS_CATEGORIES, MOVIE_GENRES } from "@/constants/index";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function JourneyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status: sessionStatus, update } = useSession();
  const { id: userId, profile } = useAppSelector((state) => state.user);
  const currentProfile = userId ? profile[userId] : null;
  const { t } = useTranslation();

  const [name, setName] = useState(currentProfile?.name || "");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    currentProfile?.preferences || []
  );
  const [selectedMovieGenres, setSelectedMovieGenres] = useState<number[]>(
    currentProfile?.moviePreferences || []
  );

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (!session) {
      router.push("/auth");
      return;
    }

    if (session.user.journeyComplete) {
      router.push("/");
    }
  }, [session, sessionStatus, router]);

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

  const handleSubmit = async () => {
    try {
      if (!userId) return;

      dispatch(
        updateProfile({
          userId,
          profile: {
            name,
            preferences: selectedPreferences,
            moviePreferences: selectedMovieGenres,
            journeyComplete: true,
          },
        })
      );

      await update({ journeyComplete: true });
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white px-4">
      <div className="w-full max-w-md  space-y-6 ">
        <h1 className="text-3xl font-bold text-center">
          {t("Complete Your Journey")}
        </h1>

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("Your Name")}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("Enter your name")}
          />
        </div>

        {/* News Preferences */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("News Preferences")}
          </label>
          <div className="flex flex-wrap gap-2">
            {NEWS_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
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

        {/* Movie Preferences */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("Movie Preferences")}
          </label>
          <div className="flex flex-wrap gap-2">
            {MOVIE_GENRES.map((genre) => (
              <button
                key={genre.id}
                type="button"
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={
            !name ||
            selectedPreferences.length === 0 ||
            selectedMovieGenres.length === 0
          }
          className="w-max px-5 mx-auto block bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 rounded-lg disabled:opacity-50"
        >
          {t("Finish Setup")}
        </button>
      </div>
    </div>
  );
}
