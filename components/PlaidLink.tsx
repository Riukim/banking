"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link"
import { useRouter } from "next/navigation"
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions"
import Image from "next/image"
import { useMediaQuery } from "react-responsive"
import { PlaidLinkProps } from "@/types"
import { useTranslation } from "react-i18next"

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter()
  const [token, setToken] = useState("")
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user)

      setToken(data?.linkToken)
    }

    getLinkToken()
  }, [user])

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      })

      router.push("/")
    },
    [user]
  )

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  }

  const { open, ready } = usePlaidLink(config)

  const { t } = useTranslation("sidebar")

  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Connect bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          onClick={() => open()}
          variant="ghost"
          className="plaidlink-ghost"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="hidden text-[16px] font-semibold text-primary xl:block">
            {t("connect")}
          </p>
        </Button>
      ) : (
        <Button
          onClick={() => open()}
          className="plaidlink-default"
        >
          <div className="relative size-6">
            <Image
              src="/icons/connect-bank.svg"
              alt="connect bank"
              fill
            />
          </div>
          <p className="text-[16px] font-semibold text-primary max-xl:hidden">
            {t("connect")}
          </p>
          {isMobile && (
            <p className="text-[16px] font-semibold text-primary">
              {t("connect")}
            </p>
          )}
        </Button>
      )}
    </>
  )
}

export default PlaidLink
