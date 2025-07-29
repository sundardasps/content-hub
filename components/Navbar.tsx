

"use client";
import { FileSearch, MoonIcon, SunIcon, LogOut, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

type Theme = "light" | "dark";

interface NavbarProps {
  theme: Theme;
  onThemeToggle: () => void;
  userName: string;
  userAvatar: string;
  onSearch?: (query: string) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeToggle,
  userName,
  userAvatar,
  onSearch,
  onLogout,
}) => {
  const [search, setSearch] = React.useState("");
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const { i18n, t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearch?.(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(search);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header
      className={`relative z-30 flex items-center justify-between h-16 px-4 sm:px-6 shadow-md rounded-2xl m-2 bg-opacity-70 backdrop-blur-xs
    ${
      theme === "dark"
        ? "bg-gray-900/70 border-b border-gray-800 text-white"
        : "bg-white/70 border-b border-gray-200 text-gray-900"
    }`}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2 font-bold text-xl">
        <span className="text-blue-600">ContentHub</span>
      </div>

      {/* Search Bar - visible inline in md+ screens */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex flex-1 max-w-md mx-6"
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder={t("Search...")}
            value={search}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border outline-none focus:ring-2 transition ${
              theme === "dark"
                ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600"
                : "bg-gray-100 border-gray-300 focus:ring-blue-400"
            }`}
          />
          <FileSearch
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
        </div>
      </form>

      {/* Search Toggle (Mobile) */}
      {showMobileSearch && (
        <form
          onSubmit={handleSearch}
          className="absolute top-16 left-0 w-full px-4 z-40 md:hidden "
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t("Search...")}
              value={search}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border outline-none focus:ring-2 transition ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600"
                  : "bg-white border-gray-300 focus:ring-blue-400"
              }`}
            />
            <FileSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </form>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile search toggle */}
        <button
          onClick={() => setShowMobileSearch((prev) => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {showMobileSearch ? <X size={20} /> : <FileSearch size={20} />}
        </button>

        {showMobileSearch && (
          <form
            onSubmit={handleSearch}
            className="absolute top-16 left-0 w-full px-4 z-40 md:hidden"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t("Search...")}
                value={search}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border outline-none focus:ring-2 transition ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600"
                    : "bg-white border-gray-300 focus:ring-blue-400"
                }`}
              />
              <FileSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </form>
        )}

        {/* Language selector - hidden on very small screens */}
        <select
          onChange={handleLanguageChange}
          value={i18n.language}
          className={`hidden sm:block px-2 py-1 rounded-lg text-xs border
            ${
              theme === "dark"
                ? "bg-gray-900 text-white"
                : "bg-gray-400 text-black"
            }`}
          aria-label={t("Select language")}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="hi">हिन्दी</option>
        </select>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={t("Toggle theme")}
          type="button"
        >
          {theme === "light" ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border object-cover"
              unoptimized
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
              {userName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <span className="hidden sm:inline text-xs font-medium">
            {userName}
          </span>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600"
        >
          <LogOut size={16} />
          <span>{t("Logout")}</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
