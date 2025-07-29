"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          {t("Welcome to Our Platform")}
        </h1>
        <p className="text-gray-500 mb-8">
          {t("Sign in or create an account with Google")}
        </p>

        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 transition"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
            width={20}
            height={20}
          />
          <span className="text-sm font-medium text-gray-700">
            {t("Continue with Google")}
          </span>
        </button>
      </div>
    </div>
  );
}