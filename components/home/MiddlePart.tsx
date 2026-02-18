"use client";
import React, { useState } from "react";
import { TbHandRingFinger } from "react-icons/tb";
import { SiHdfcbank } from "react-icons/si";
import { Account } from "@/interfaces/account";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BiCamera } from "react-icons/bi";

const MiddlePart = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      bankName: "HDFC Bank",
      amount: "1,21,345.67",
      spent: "2,345.87",
      upcomingBills: "4,345.87",
      income: "1,00,000.00",
    },
    {
      bankName: "ICICI Bank",
      amount: "85,000.50",
      spent: "1,200.00",
      upcomingBills: "2,500.00",
      income: "75,000.00",
    },
  ]);

  const [balance, setBalance] = useState<{ key: string; value: string }[]>([
    {
      key: "Total Spent",
      value: "3,545.87",
    },
    {
      key: "Total Income",
      value: "1,75,000.00",
    },
    {
      key: "Bills Due",
      value: "10,000.00",
    },
    {
      key: "Total Investments",
      value: "50,000.00",
    },
  ]);

  return (
    <>
      <div className="mx-3 sm:mx-5 lg:mx-10">
        {/* Greeting */}
        <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
          <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold">
            Good Morning, Aditi!!
          </p>
          <TbHandRingFinger className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#3AA9FF] stroke-0 fill-yellow-400" />
        </div>

        {/* Wallet & Accounts */}
        <div className="flex flex-col my-3">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-2">
            Wallet & Accounts
          </p>

          {/* Main Wallet Card */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 py-3 scrollbar-thin scrollbar-track-transparent">
            {accounts.map((account, index) => (
              <div
                key={index}
                className="snap-start shrink-0 w-fit border-3 px-4 sm:px-5 py-3 pb-5 border-[#3AA9FF] rounded-2xl drop-shadow-[0_0_18px_#3AA9FF] brightness-125"
              >
                {/* Top Row */}
                <div className="flex justify-between items-center">
                  <p className="text-sm sm:text-base">{account.bankName}</p>
                  <SiHdfcbank className="text-xl sm:text-2xl text-[#3AA9FF] drop-shadow-[0_0_8px_#3AA9FF]" />
                </div>

                {/* Amount */}
                <div className="mt-3">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    Rs. {account.amount}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="w-fit mt-8 gap-4 grid grid-cols-2 md:flex md:flex-nowrap md:justify-between">
                  {/* item 1 */}
                  <div className="border-3 py-2 px-4 text-center border-[#3AA9FF] rounded-2xl drop-shadow-[0_0_1px_#3AA9FF] brightness-80">
                    <p className="text-sm sm:text-base">Spent</p>
                    <p className="text-base sm:text-lg font-semibold">
                      Rs. {account.spent}
                    </p>
                  </div>

                  {/* item 2 */}
                  <div className="border-3 py-2 px-4 text-center border-[#3AA9FF] rounded-2xl drop-shadow-[0_0_1px_#3AA9FF] brightness-80">
                    <p className="text-sm sm:text-base">Upcoming Bills</p>
                    <p className="text-base sm:text-lg font-semibold">
                      Rs. {account.upcomingBills}
                    </p>
                  </div>

                  {/* item 3 - centered on small screens */}
                  <div className="border-3 py-2 px-4 text-center border-[#3AA9FF] rounded-2xl drop-shadow-[0_0_1px_#3AA9FF] brightness-80 col-span-2 mx-auto md:col-span-1 md:mx-0">
                    <p className="text-sm sm:text-base">Income</p>
                    <p className="text-base sm:text-lg font-semibold">
                      Rs. {account.income}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overview quick Stats */}
        <div className="flex flex-col my-3 md:my-7 lg:my-10">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-2">
            Overview Quick Stats
          </p>

          {/* Main Wallet Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {balance.map((balance, index) => {
              const numericValue = parseFloat(balance.value.replace(/,/g, ""));
              const formattedValue: string =
                numericValue % 1 === 0
                  ? numericValue.toFixed(0)
                  : numericValue.toFixed(2);

              return (
                <div
                  key={index}
                  className="flex justify-between px-4 sm:px-5 py-3 pb-5 h-full border-3 border-[#3AA9FF] rounded-2xl drop-shadow-[0_0_1px_#3AA9FF] brightness-80"
                >
                  <div className="flex flex-col justify-between">
                    <p className="text-sm sm:text-base font-semibold">
                      {balance.key}
                    </p>
                    <p className="text-base sm:text-lg font-semibold">
                      Rs. {formattedValue}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    {balance.key.toLowerCase().includes("income") ||
                    balance.key.toLowerCase().includes("investment") ? (
                      <FaLongArrowAltUp className="text-green-500 text-xl" />
                    ) : balance.key.toLowerCase().includes("spent") ||
                      balance.key.toLowerCase().includes("bills") ? (
                      <FaLongArrowAltDown className="text-red-500 text-xl" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add transaction */}
        <div className="flex flex-wrap items-center justify-between my-6">
          {/* Add Income Button */}
          <button className="cursor-pointer w-fit py-3 px-3 md:px-5 lg:px-8 rounded-full border-2 text-sm md:text-xl border-transparent bg-linear-to-r from-green-200 to-green-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 sm:w-auto">
            <IoIosAddCircleOutline className="inline mr-0.5 md:mr-3 text-2xl text-white" />{" "}
            Add Income
          </button>

          {/* Add Expense Button */}
          <button className="cursor-pointer w-fit py-3 px-3 md:px-5 lg:px-8 rounded-full border-2 text-sm md:text-xl border-transparent bg-linear-to-r from-red-400 to-red-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 sm:w-auto">
            <IoIosAddCircleOutline className="inline mr-0.5 md:mr-3 text-2xl text-white" />{" "}
            Add Expense
          </button>

          {/* Scan Receipt Button */}
          <button className="cursor-pointer w-fit py-2 md:py-3 px-2 md:px-5 lg:px-8 rounded-full border-2 text-sm md:text-xl border-transparent bg-linear-to-r from-[#3AA9FF] to-[#004a82] text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 sm:w-auto">
            <BiCamera className="inline md:mr-3 text-2xl text-white" />
            <span className="hidden sm:inline">Scan Receipt</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MiddlePart;
