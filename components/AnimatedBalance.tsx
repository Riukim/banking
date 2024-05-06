"use client"

import React from 'react'
import CountUp from 'react-countup'

const AnimatedBalance = ({ amount }: {amount: number}) => {
  return (
    <div className='w-full'>
      <CountUp
        decimal=','
        prefix='$'
        decimals={2}
        duration={2}
        end={amount}
      />
    </div>
  )
}

export default AnimatedBalance