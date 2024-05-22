"use client"

import { sidebarLinks } from '@/constants'
import { cn, removeLocaleFromPath } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Footer from './Footer'
import PlaidLink from './PlaidLink'
import { ModeToggle } from './ModeToggle'
import { SiderbarProps } from '@/types'
import { useTranslation } from 'react-i18next'
import LanguageChanger from './LanguageChanger'

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname()
  const normalizePathname = removeLocaleFromPath(pathname)
  const {t} = useTranslation("sidebar")

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link
          className="mb-12 flex cursor-pointer items-center gap-2"
          href="/"
        >
          <Image
            src="/icons/logo.svg"
            alt="Horizon logo"
            width={34}
            height={34}
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive =
            normalizePathname === item.route ||
            normalizePathname.startsWith(`${item.route}/`)

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
            >
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {t(item.label)}
              </p>
            </Link>
          )
        })}

        <PlaidLink
          variant="ghost"
          user={user}
        />

        <div className="flex flex-col xl:flex-row gap-10 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start hover:!bg-none">
          <ModeToggle />
          <LanguageChanger />
        </div>
      </nav>

      <Footer user={user} />
    </section>
  )
}

export default Sidebar