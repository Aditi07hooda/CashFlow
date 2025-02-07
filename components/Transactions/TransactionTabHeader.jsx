import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const TransactionTabHeader = ({ selectedTab, setSelectedTab }) => {
  return (
    <View className="flex flex-row justify-around w-full">
      {["Daily", "Monthly", "Budget", "Stats", "Note"].map((tab) => (
        <View
          key={tab}
          className={`${selectedTab.selectedTab === tab ? "rounded-xl bg-[#f87171] text-white" : "bg-inherit"} px-4 py-2`}
        >
          <TouchableOpacity
            onPress={() =>
              setSelectedTab((prev) => ({ ...prev, selectedTab: tab }))
            }
          >
            <Text>{tab}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default TransactionTabHeader;
