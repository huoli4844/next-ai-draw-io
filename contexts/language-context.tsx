"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import enMessages from "@/messages/en.json"
import zhMessages from "@/messages/zh.json"

type Messages = typeof enMessages
type Locale = "en" | "zh"

interface LanguageContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string, params?: Record<string, string | number>) => string
}

const messages: Record<Locale, Messages> = {
    en: enMessages,
    zh: zhMessages,
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined,
)

const STORAGE_LOCALE_KEY = "next-ai-draw-io-locale"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en")
    const [isLoaded, setIsLoaded] = useState(false)

    // Load locale from localStorage on mount
    useEffect(() => {
        const savedLocale = localStorage.getItem(STORAGE_LOCALE_KEY) as Locale
        if (savedLocale && (savedLocale === "en" || savedLocale === "zh")) {
            setLocaleState(savedLocale)
        }
        setIsLoaded(true)
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem(STORAGE_LOCALE_KEY, newLocale)
    }

    const t = (
        key: string,
        params?: Record<string, string | number>,
    ): string => {
        const keys = key.split(".")
        let value: any = messages[locale]

        for (const k of keys) {
            value = value?.[k]
        }

        if (typeof value !== "string") {
            console.warn(`Translation key not found: ${key}`)
            return key
        }

        // Replace parameters in the string
        if (params) {
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param]?.toString() || match
            })
        }

        return value
    }

    // Don't render children until locale is loaded to avoid hydration mismatch
    if (!isLoaded) {
        return null
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
