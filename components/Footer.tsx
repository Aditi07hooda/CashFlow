import React from "react";
import { LiaFacebookSquare } from "react-icons/lia";
import { FaSquareXTwitter } from "react-icons/fa6";
import { SlSocialYoutube } from "react-icons/sl";

const Footer = () => {
  return (
    <div className="w-full border-[#3AA9FF] drop-shadow-[0_0_18px_#3AA9FF] brightness-125 rounded-2xl shadow-b-sm px-4 py-3 flex flex-col md:flex-row items-center justify-between sticky z-50 bg-[#001423] text-white">
      {/* Branding Section */}
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h2 className="text-3xl font-semibold text-[#3AA9FF]">CashFlow</h2>
        <p className="text-sm text-[#A3B1C3]">Simplifying Your Financial Future</p>
      </div>

      {/* Quick Links Section */}
      <div className="flex flex-col md:flex-row md:space-x-10 mb-4 md:mb-0 text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <h3 className="font-semibold text-[#3AA9FF] mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <p className="hover:underline cursor-pointer">About Us</p>
            </li>
            <li>
              <p className="hover:underline cursor-pointer">Blog</p>
            </li>
            <li>
              <p className="hover:underline cursor-pointer">Contact</p>
            </li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h3 className="font-semibold text-[#3AA9FF] mb-2">Legal</h3>
          <ul className="space-y-2">
            <li>
              <p className="hover:underline cursor-pointer">Privacy Policy</p>
            </li>
            <li>
              <p className="hover:underline cursor-pointer">Terms of Service</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex flex-wrap justify-between space-x-4 mb-4 md:mb-0">
        <LiaFacebookSquare className="text-3xl text-[#3AA9FF] hover:scale-110 transition" />
        <FaSquareXTwitter className="text-3xl text-[#3AA9FF] hover:scale-110 transition" />
        <SlSocialYoutube className="text-3xl text-[#3AA9FF] hover:scale-110 transition" />
      </div>

      {/* Footer Text and Links */}
      <div className="text-center md:text-left">
        {/* Copyright Symbol and Year */}
        <p className="mb-2">
          <span>&#169;</span> 2025 CashFlow. All rights reserved.
        </p>

        {/* Language Change Option */}
        <div>
          <p className="hover:underline cursor-pointer">English (Change)</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;