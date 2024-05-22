import initTranslations from "@/app/i18n"
import HeaderBox from "@/components/HeaderBox"
import PaymentTransferForm from "@/components/PaymentTransferForm"
import TranslationsProvider from "@/components/TranslationProvider"
import { getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import { SearchParamProps } from "@/types"
import React, { Suspense } from "react"
import Loading from "../loading"

const i18nNamespaces = ["Transfer", "TransferForm"]

const Transfer = async ({ params: { locale } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id })

  if (!accounts) return

  const accountsData = accounts?.data

  const { t, resources } = await initTranslations(locale, i18nNamespaces)

  return (
    <Suspense fallback={<Loading />} >
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={i18nNamespaces}
      >
        <section className="payment-transfer">
          <HeaderBox
            title={t("title")}
            subtext={t("subtext")}
          />
          <section className="size-full pt-5">
            <PaymentTransferForm accounts={accountsData} />
          </section>
        </section>
      </TranslationsProvider>
    </Suspense>
  )
}

export default Transfer
