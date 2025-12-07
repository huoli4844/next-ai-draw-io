"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/contexts/language-context"

interface SettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCloseProtectionChange?: (enabled: boolean) => void
}

export const STORAGE_ACCESS_CODE_KEY = "next-ai-draw-io-access-code"
export const STORAGE_CLOSE_PROTECTION_KEY = "next-ai-draw-io-close-protection"

export function SettingsDialog({
    open,
    onOpenChange,
    onCloseProtectionChange,
}: SettingsDialogProps) {
    const { t } = useLanguage()
    const [accessCode, setAccessCode] = useState("")
    const [closeProtection, setCloseProtection] = useState(true)
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (open) {
            const storedCode =
                localStorage.getItem(STORAGE_ACCESS_CODE_KEY) || ""
            setAccessCode(storedCode)

            const storedCloseProtection = localStorage.getItem(
                STORAGE_CLOSE_PROTECTION_KEY,
            )
            // Default to true if not set
            setCloseProtection(storedCloseProtection !== "false")
            setError("")
        }
    }, [open])

    const handleSave = async () => {
        setError("")
        setIsVerifying(true)

        try {
            // Verify access code with server
            const response = await fetch("/api/verify-access-code", {
                method: "POST",
                headers: {
                    "x-access-code": accessCode.trim(),
                },
            })

            const data = await response.json()

            if (!data.valid) {
                setError(data.message || t("settings.invalidCode"))
                setIsVerifying(false)
                return
            }

            // Save settings only if verification passes
            localStorage.setItem(STORAGE_ACCESS_CODE_KEY, accessCode.trim())
            localStorage.setItem(
                STORAGE_CLOSE_PROTECTION_KEY,
                closeProtection.toString(),
            )
            onCloseProtectionChange?.(closeProtection)
            onOpenChange(false)
        } catch {
            setError("Failed to verify access code")
        } finally {
            setIsVerifying(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSave()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("settings.title")}</DialogTitle>
                    <DialogDescription>
                        {t("settings.description")}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t("settings.accessCode")}
                        </label>
                        <Input
                            type="password"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t("settings.accessCodePlaceholder")}
                            autoComplete="off"
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            {t("settings.accessCodeDesc")}
                        </p>
                        {error && (
                            <p className="text-[0.8rem] text-destructive">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="close-protection">
                                {t("settings.closeProtection")}
                            </Label>
                            <p className="text-[0.8rem] text-muted-foreground">
                                {t("settings.closeProtectionDesc")}
                            </p>
                        </div>
                        <Switch
                            id="close-protection"
                            checked={closeProtection}
                            onCheckedChange={setCloseProtection}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("settings.cancel")}
                    </Button>
                    <Button onClick={handleSave} disabled={isVerifying}>
                        {isVerifying
                            ? t("settings.verifying")
                            : t("settings.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
