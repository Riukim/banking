import initTranslations from "@/app/i18n"
import HeaderBox from "@/components/HeaderBox"
import { Pagination } from "@/components/Pagination"
import TransactionsTable from "@/components/TransactionsTable"
import TranslationsProvider from "@/components/TranslationProvider"
import { getAccount, getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import { formatAmount } from "@/lib/utils"
import { SearchParamProps } from "@/types"
import React, { Suspense } from "react"
import Loading from "../loading"

const i18nNamespaces = ["History", "transactionTable", "pagination"]

const TransactionHistory = async ({
  searchParams: { id, page },
  params: { locale },
}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id })

  if (!accounts) return

  const accountsData = accounts?.data
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId

  const account = await getAccount({ appwriteItemId })

  const rowsPerPage = 10
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage)

  const indexOfLastTransaction = currentPage * rowsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage

  const currentTransaction = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  )

  const { t, resources } = await initTranslations(locale, i18nNamespaces)

  return (
    <Suspense fallback={<Loading />}>
      <TranslationsProvider
        resources={resources}
        locale={locale}
        namespaces={i18nNamespaces}
      >
        <section className="transactions">
          <div className="transactios-header">
            <HeaderBox
              title={t("title")}
              subtext={t("subtext")}
            />
          </div>
          <div className="space-y-6">
            <div className="transactions-account">
              <div className="flex flex-col gap-2">
                <h2 className="text-18 font-bold text-white">
                  {account?.data.name}
                </h2>
                <p className="text-14 text-blue-25">
                  {account?.data.officialName}
                </p>
                <p className="text-14 font-semibold tracking-[1.1px] text-white">
                  ●●●● ●●●● ●●●● {account?.data.mask}
                </p>
              </div>
              <div className="transactions-account-balance">
                <p className="text-14">{t("balance")}</p>
                <p className="text-24 text-center font-bold">
                  {formatAmount(account?.data.currentBalance)}
                </p>
              </div>
            </div>
            <section className="flex w-full flex-col gap-6">
              <TransactionsTable transactions={currentTransaction} />
              {totalPages > 1 && (
                <div className="my-4 w-full">
                  <Pagination
                    totalPages={totalPages}
                    page={currentPage}
                  />
                </div>
              )}
            </section>
          </div>
        </section>
      </TranslationsProvider>
    </Suspense>
  )
}

export default TransactionHistory
