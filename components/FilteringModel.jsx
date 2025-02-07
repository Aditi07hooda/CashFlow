import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icons from "react-native-vector-icons/Entypo";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const FilteringModel = ({ state, setState }) => {
  const [states, setStates] = useState({
    selectedTab: "Account",
  });
  return (
    <View className="h-full bg-gray-50">
      <View className="flex flex-row justify-between">
        <View className="w-fit px-4 flex items-center justify-center">
          <Text className="text-lg font-semibold">{monthNames[new Date().getMonth()]}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            setState((prev) => ({
              ...prev,
              showFilteringModel: false,
            }))
          }
          className="py-3 rounded-md px-4"
        >
          <Icons name="cross" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View className="py-2 px-3 bg-[#d4eff1]">
        <Text className="text-base font-semibold">
          Select items that you want to filter
        </Text>
      </View>
      <View className="flex flex-row justify-around w-full mt-4">
        {["Income", "Expense", "Account"].map((tab) => (
          <View
            key={tab}
            className={`${
              states.selectedTab === tab
                ? "rounded-xl bg-[#f87171] text-white"
                : "bg-inherit"
            } px-4 py-2`}
          >
            <TouchableOpacity
              onPress={() =>
                setStates((prev) => ({ ...prev, selectedTab: tab }))
              }
            >
              <Text>{tab}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View>
      </View>
    </View>
  );
};

export default FilteringModel;
