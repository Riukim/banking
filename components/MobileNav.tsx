"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn, removeLocaleFromPath } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer"
import PlaidLink from "./PlaidLink"
import { ModeToggle } from "./ModeToggle"
import { MobileNavProps } from "@/types"
import { useTranslation } from "react-i18next"
import LanguageChanger from "./LanguageChanger"

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname()
  const normalizePathname = removeLocaleFromPath(pathname)

  const { t } = useTranslation("sidebar")

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-none bg-background"
        >
          <Link
            className="flex cursor-pointer items-center gap-1 px-4"
            href="/"
          >
            <Image
              src="/icons/logo.svg"
              alt="Horizon logo"
              width={34}
              height={34}
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-bankGradient">
              Horizon
            </h1>
          </Link>

          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-primary">
                {sidebarLinks.map((item) => {
                  const isActive =
                    normalizePathname === item.route ||
                    normalizePathname.startsWith(`${item.route}/`)
                  return (
                    <SheetClose
                      asChild
                      key={item.route}
                    >
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": isActive,
                        })}
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn({
                            "brightness-[3] invert-0": isActive,
                          })}
                        />

                        <p
                          className={cn("text-16 font-semibold text-primary", {
                            "!text-white": isActive,
                          })}
                        >
                          {t(item.label)}
                        </p>
                      </Link>
                    </SheetClose>
                  )
                })}

                <div className="flex gap-1">
                  <PlaidLink user={user} />
                </div>

                <div className="flex items-center gap-10 px-4">
                  <ModeToggle />
                  <LanguageChanger />
                </div>
              </nav>
            </SheetClose>

            <Footer
              user={user}
              type="mobile"
            />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav
