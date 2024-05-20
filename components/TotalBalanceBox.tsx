"use client"

import React from 'react'
import AnimatedBalance from './AnimatedBalance'
import DoughnutChart from './DoughnutChart'
import { TotlaBalanceBoxProps } from '@/types'
import { useTranslation } from 'react-i18next'

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance
}: TotlaBalanceBoxProps) => {
  
  const { t } = useTranslation("balanceBox")

  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart  accounts={accounts} />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="header-2">
          Bank {totalBanks === 1 ? "Account" : "Accounts"}: {totalBanks}
        </h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">
            {t("balance")}
          </p>
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedBalance amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox