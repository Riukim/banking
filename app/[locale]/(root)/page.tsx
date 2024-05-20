import initTranslations from "@/app/i18n"
import HeaderBox from "@/components/HeaderBox"
import RecentTransactions from "@/components/RecentTransactions"
import RightSidebar from "@/components/RightSidebar"
import TotalBalanceBox from "@/components/TotalBalanceBox"
import TranslationsProvider from "@/components/TranslationProvider"
import { getAccount, getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import { SearchParamProps } from "@/types"
import React from "react"

const i18nNamespaces = [
  "headerBox",
  "balanceBox",
  "recentTransaction",
  "transactionTable",
  "pagination",
  "rightSidebar",
  "sidebar"
]

const Home = async ({
  searchParams: { id, page}, params: {locale}
}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id })

  if (!accounts) return

  const accountsData = accounts?.data
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId

  const account = await getAccount({ appwriteItemId })

  const { t, resources } = await initTranslations(
    locale,
    i18nNamespaces
  )

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <section className="home">
        <div className="home-content">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title={t("title")}
              user={loggedIn?.firstName || "Guest"}
              subtext={t("subText")}
            />

            <TotalBalanceBox
              accounts={accountsData}
              totalBanks={accounts?.totalBanks}
              totalCurrentBalance={accounts?.totalCurrentBalance}
            />
          </header>

          <RecentTransactions
            accounts={accountsData}
            transactions={account?.transactions}
            appwriteItemId={appwriteItemId}
            page={currentPage}
          />
        </div>

        <RightSidebar
          user={loggedIn}
          transactions={account?.transactions}
          banks={accountsData?.slice(0, 2)}
        />
      </section>
    </TranslationsProvider>
  )
}

export default Home
