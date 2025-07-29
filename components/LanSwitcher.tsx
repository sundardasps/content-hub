'use client'
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => switchLanguage(e.target.value)}
        className="px-3 py-2 border rounded-md"
      >
        {locales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.flag} {loc.name}
          </option>
        ))}
      </select>
    </div>
  );
}