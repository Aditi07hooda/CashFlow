import React from "react";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GiNotebook } from "react-icons/gi";
import { TbReport } from "react-icons/tb";

const LeftPart = () => {
  return (
    <>
      <div className="text-xl font-bold flex flex-col flex-wrap gap-16">
        <div className="flex flex-col justify-content-center justify-items-center items-center gap-2 hover:scale-110">
          <MdDashboard className="text-4xl text-[#3AA9FF] drop-shadow-[0_0_8px_#3AA9FF] cursor-pointer" />
          <p className="drop-shadow-[0_0_1px_white] brightness-100 cursor-pointer">Dashboard</p>
        </div>
        <div className="flex flex-col justify-content-center justify-items-center items-center gap-2  hover:scale-110">
          <GiNotebook className="text-4xl text-[#3AA9FF] drop-shadow-[0_0_8px_#3AA9FF] cursor-pointer" />
          <p className="drop-shadow-[0_0_1px_white] brightness-100 cursor-pointer">Transactions</p>
        </div>
        <div className="flex flex-col justify-content-center justify-items-center items-center gap-2  hover:scale-110">
          <TbReport className="text-4xl text-[#3AA9FF] drop-shadow-[0_0_8px_#3AA9FF] cursor-pointer" />
          <p className="drop-shadow-[0_0_1px_white] brightness-100 cursor-pointer">Report</p>
        </div>
        <div className="flex flex-col justify-content-center justify-items-center items-center gap-2  hover:scale-110">
          <CgProfile className="text-4xl text-[#3AA9FF] drop-shadow-[0_0_8px_#3AA9FF] cursor-pointer" />
          <p className="drop-shadow-[0_0_1px_white] brightness-100 cursor-pointer">Profile</p>
        </div>
      </div>
    </>
  );
};

export default LeftPart;
