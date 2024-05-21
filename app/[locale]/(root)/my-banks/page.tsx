import initTranslations from "@/app/i18n"
import BankCard from "@/components/BankCard"
import HeaderBox from "@/components/HeaderBox"
import TranslationsProvider from "@/components/TranslationProvider"
import { getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import { Account, SearchParamProps } from "@/types"
import React from "react"

const i18nNamespaces = ["MyBanks"]

const MyBanks = async ({ params: { locale } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id })

  const { t, resources } = await initTranslations(locale, i18nNamespaces)

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <section className="flex">
        <div className="my-banks">
          <HeaderBox
            title={t("title")}
            subtext={t("subtext")}
          />

          <div className="space-y-4">
            <h2 className="header-2">{t("cards")}</h2>
            <div className="flex flex-wrap gap-6">
              {accounts &&
                accounts.data.map((a: Account) => (
                  <BankCard
                    key={accounts.id}
                    account={a}
                    userName={loggedIn?.firstName}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    </TranslationsProvider>
  )
}

export default MyBanks
