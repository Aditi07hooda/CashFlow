import React from "react";
import LeftPart from "./LeftPart";
import MiddlePart from "./MiddlePart";
// import RightPart from "./RightPart";

const HomeComponent = () => {
  return (
    <>
      {/* <div className="grid md:grid-cols-[1.2fr_5fr_1.4fr] grid-flow-col h-full py-5 md:py-10"> ---> for ai assitance side*/} 
      <div className="grid md:grid-cols-[1.2fr_5fr] grid-flow-col h-full py-5 md:py-10">
        <div className="border-r-2 hidden lg:block">
          <LeftPart />
        </div>
        <div className="">
          <MiddlePart />
        </div>
        {/* <div className="border-l-2 hidden lg:block">
          <RightPart />
        </div> */}
      </div>
    </>
  );
};

export default HomeComponent;
