"use client";

import { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/lib/reducers/userSlice";
import { persistor, useAppSelector } from "@/lib/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import { useTheme } from "@/hooks/ThemeContext";
import PreferencesModal from "@/components/PreferenceDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();
  const [rawQuery, setRawQuery] = useState("");
  const dispatch = useDispatch();
  const user = useAppSelector((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogout = async () => {
    dispatch(clearUser());
    await persistor.purge();
    await signOut({ callbackUrl: "/auth" });
  };

  // one debounce here
  const debouncedPush = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set("q", value);
        else params.delete("q");

        const next = `${pathname}${params.toString() ? `?${params}` : ""}`;
        router.replace(next, { scroll: false });
      }, 400),
    [pathname, router, searchParams]
  );

  useEffect(() => {
    debouncedPush(rawQuery);
    return () => debouncedPush.cancel();
  }, [rawQuery, debouncedPush]);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      className={`h-screen flex z-0 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Sidebar theme={theme} onOpenSettings={() => setModalOpen(true)} />
      <div className="flex-1 flex flex-col ">
        <Navbar
          theme={theme}
          onThemeToggle={toggleTheme}
          userName={user.profile[user?.id]?.name}
          userAvatar={user?.image}
          onSearch={setRawQuery} // parent debounces
          onLogout={handleLogout}
        />
        <PreferencesModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        <main
          className={`flex-1 p-6 overflow-y-auto relative  ${
            theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-gray-900  border-gray-300"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
