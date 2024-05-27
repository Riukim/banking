"use client"

import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import i18nConfig from "@/i18nConfig"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import ita from "@/public/icons/it.svg"
import eng from "@/public/icons/gb.svg"
import fra from "@/public/icons/fr.svg"
import Image from "next/image"

export default function LanguageChanger() {
  const { i18n } = useTranslation()
  const currentLocale = i18n.language
  const router = useRouter()
  const currentPathname = usePathname()

  //console.log("current locale", currentLocale)

  const handleChange = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = date.toUTCString()
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`

    // redirect to the new locale path
    if (currentLocale === i18nConfig.defaultLocale) {
      router.push("/" + newLocale + currentPathname)
    } else {
      router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`))
    }

    router.refresh()
  }

  return (
    <Select
      onValueChange={handleChange}
      value={currentLocale}
    >
      <SelectTrigger className="w-[130px] max-xl:w-[4rem] hover:bg-blue-25 dark:hover:bg-muted/50">
        <SelectValue placeholder="Change Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          <span className="text-primary inline-flex max-xl:hidden gap-2">
            English
            <Image
              src={eng}
              alt="English"
              className="max-xl:hidden inline"
              width={18}
            />
          </span>
          <Image
            src={eng}
            alt="English"
            className="hidden max-xl:inline"
            width={24}
          />
        </SelectItem>
        <SelectItem value="it">
          <span className="text-primary inline-flex max-xl:hidden gap-2">
            Italiano
            <Image
              src={ita}
              alt="Italian"
              className="max-xl:hidden inline"
              width={18}
            />
          </span>
          <Image
            src={ita}
            alt="Italian"
            className="hidden max-xl:inline"
            width={24}
          />
        </SelectItem>
        <SelectItem value="fr">
          <span className="text-primary inline-flex max-xl:hidden gap-2">
            Français
            <Image
              src={fra}
              alt="French"
              className="max-xl:hidden inline"
              width={18}
            />
          </span>
          <Image
            src={fra}
            alt="French"
            className="hidden max-xl:inline"
            width={24}
          />
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
