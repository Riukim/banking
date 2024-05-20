"use client"

import { HeaderBoxProps } from "@/types"
import React from "react"
import { useTranslation } from "react-i18next"

const HeaderBox = ({
  type = "title",
  title,
  subtext,
  user,
}: HeaderBoxProps) => {
   const { t } = useTranslation()

  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === "greeting" && (
          <span className="text-bankGradient">
            &nbsp;{user}
          </span>
        )}
      </h1>
      <p className="header-box-subtext">
        {subtext}
      </p>
    </div>
  )
}

export default HeaderBox
