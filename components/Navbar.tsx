"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { LuBell } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { HiMenu, HiX } from "react-icons/hi";
import Icon from "@/public/images/icon.webp";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = ["Dashboard", "Transactions", "Reports", "Profile"];

  return (
    <nav className="w-full shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50 bg-[#001423]">
      {/* LEFT - LOGO */}
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
          <Image
            src={Icon}
            alt="CashFlow"
            fill
            className="object-contain drop-shadow-[0_0_6px_#3AA9FF]"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold drop-shadow-[0_0_2px_white] brightness-125">
          CashFlow
        </h1>
      </div>

      {/* CENTER - DESKTOP NAV LINKS */}
      <div className="hidden md:flex gap-8">
        {navItems.map((item) => (
          <div key={item} className="relative group pb-1 cursor-pointer">
            <p className="text-lg font-semibold hover:text-[#3AA9FF] transition-all">
              {item}
            </p>

            {/* Gradient underline */}
            <span
              className="
                  absolute left-0 bottom-0 w-full h-[3px]
                  bg-linear-to-r from-[#3AA9FF] via-[#61C3FF] to-[#3AA9FF]
                  rounded-full
                  scale-x-0 group-hover:scale-x-100
                  transition-transform duration-300 origin-left
                "
            ></span>
          </div>
        ))}
      </div>

      {/* RIGHT - ICONS */}
      <div className="flex items-center gap-4">
        <FiSearch className="hidden md:block text-[22px] md:text-[27px] hover:text-[#3AA9FF] hover:scale-110 transition" />
        <LuBell className="text-[22px] md:text-[25px] lg:text-[27px] hover:text-[#3AA9FF] hover:scale-110 transition" />
        <CgProfile className="text-[22px] md:text-[25px] lg:text-[27px] hover:text-[#3AA9FF] hover:scale-110 transition hidden md:block" />

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`
          absolute left-0 top-full w-full bg-[#103a5b] shadow-md
          md:hidden flex flex-col gap-4 px-5 py-4 transition-all
          ${open ? "opacity-100 max-h-64" : "opacity-0 max-h-0 overflow-hidden"}
        `}
      >
        {navItems.map((item) => (
          <p
            key={item}
            className="text-lg font-medium py-2 border-b cursor-pointer hover:text-[#3AA9FF] transition"
          >
            {item}
          </p>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
