"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { formUrlQuery } from "@/lib/utils"
import { PaginationProps } from "@/types"
import { useTranslation } from "react-i18next"

export const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()!

  const handleNavigation = (type: "prev" | "next") => {
    const pageNumber = type === "prev" ? page - 1 : page + 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageNumber.toString(),
    })

    router.push(newUrl, { scroll: false })
  }

  const {t} = useTranslation("pagination")

  return (
    <div className="flex justify-between gap-3">
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation("prev")}
        disabled={Number(page) <= 1}
      >
        <Image
          src="/icons/arrow-left.svg"
          alt="arrow"
          width={20}
          height={20}
          className="mr-2"
        />
        {t("prev")}
      </Button>
      <p className="text-14 flex items-center px-2">
        {page} / {totalPages}
      </p>
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation("next")}
        disabled={Number(page) >= totalPages}
      >
        {t("next")}
        <Image
          src="/icons/arrow-left.svg"
          alt="arrow"
          width={20}
          height={20}
          className="ml-2 -scale-x-100"
        />
      </Button>
    </div>
  )
}
