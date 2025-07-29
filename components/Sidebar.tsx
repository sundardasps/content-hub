
"use client";

import { Newspaper, ChartAreaIcon, Star, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function Sidebar({ theme, onOpenSettings }: { theme: string; onOpenSettings?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const sidebarRef = useRef(null);

  const iconColor = theme === "dark" ? "#fff" : "#1e293b";

  const navItems = [
    {
      id: "feed",
      label: t("Feed"),
      href: "/dashboard/feed",
      icon: <Newspaper size={22} color={iconColor} />,
      subTitles: [
        { label: t("News"), href: "/dashboard/feed" },
        { label: t("Recommendations"), href: "/dashboard/feed/recommendations" },
      ],
    },
    {
      id: "trending",
      label: t("Trending"),
      href: "/dashboard/trending",
      icon: <ChartAreaIcon size={22} color={iconColor} />,
    },
    {
      id: "favorites",
      label: t("Favorites"),
      href: "/dashboard/favorites",
      icon: <Star size={22} color={iconColor} />,
    },
  ];

  const isActive = (item) => {
    if (pathname === item.href) return true;
    if (item.subTitles) {
      return item.subTitles.some((sub) => sub.href === pathname);
    }
    return false;
  };

  return (
    <div className="flex items-center justify-center flex-col  py-6 px-2">
      <aside ref={sidebarRef} className="flex flex-col items-center justify-start gap-6">
        {/* Navigation Items */}
        <nav className="flex flex-col gap-4 items-center">
          {navItems.map(({ id, icon, label, href, subTitles }) => {
            const active = isActive({ href, subTitles });
            return (
              <div key={id} className="group relative flex items-center">
                <button
                  type="button"
                  onClick={() => router.push(href)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all
                    ${
                      active
                        ? theme === "dark"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-blue-200 text-blue-700 shadow-lg"
                        : theme === "dark"
                          ? "bg-transparent text-gray-400 hover:bg-blue-900 hover:text-blue-300"
                          : "bg-transparent text-gray-500 hover:bg-blue-100 hover:text-blue-700"
                    }
                    group-hover:shadow-lg
                  `}
                  aria-label={label}
                >
                  {icon}
                </button>

                {/* Submenu */}
                <div
                  className={`absolute z-50 left-12 top-1/2 -translate-y-1/2 flex flex-col min-w-[120px] rounded-md shadow-lg
                    ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
                    opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200`}
                  style={{ zIndex: 10 }}
                >
                  <button
                    type="button"
                    onClick={() => router.push(href)}
                    className={`px-4 py-2 text-sm text-left font-bold rounded-t-md transition-colors ${
                      active
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </button>
                  {subTitles && (
                    <div className="flex flex-col">
                      {subTitles.map((sub) => (
                        <button
                          key={sub.href}
                          type="button"
                          onClick={() => router.push(sub.href)}
                          className={`px-4 py-2 text-xs text-left rounded-b-md transition-colors ${
                            pathname === sub.href
                              ? theme === "dark"
                                ? "bg-blue-800 text-white"
                                : "bg-blue-50 text-blue-700"
                              : theme === "dark"
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-50"
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Settings Button */}
        <div className="mt-auto">
          <button
            type="button"
            onClick={onOpenSettings}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all
              ${theme === "dark"
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"}`}
            aria-label={t("Settings")}
          >
            <Settings size={22} color={iconColor} />
          </button>
        </div>
      </aside>
    </div>
  );
}
