"use client"

import { useLanguage } from "@/contexts/language-context"

const localeNames: Record<string, string> = {
    en: "English",
    zh: "中文",
}

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage()

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setLocale("en")}
                className={`px-2 py-1 text-sm rounded transition-colors ${
                    locale === "en"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600"
                }`}
                type="button"
            >
                {localeNames["en"]}
            </button>
            <span className="text-gray-400">|</span>
            <button
                onClick={() => setLocale("zh")}
                className={`px-2 py-1 text-sm rounded transition-colors ${
                    locale === "zh"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600"
                }`}
                type="button"
            >
                {localeNames["zh"]}
            </button>
        </div>
    )
}
