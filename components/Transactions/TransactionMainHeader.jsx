import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/FontAwesome";

const TransactionMainHeader = ({ selectedMonth, setSelectedMonth }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleMonthChange = (type) => {
    setSelectedMonth((prev) => {
      let newMonth = prev.selectedMonth;
      let newYear = prev.selectedYear;

      if (type === "next") {
        newMonth += 1;
        if (newMonth > 11) {
          newMonth = 0;
          newYear += 1;
        }
      } else if (type === "prev") {
        newMonth -= 1;
        if (newMonth < 0) {
          newMonth = 11;
          newYear -= 1;
        }
      }

      return {
        ...prev,
        selectedMonth: newMonth,
        selectedYear: newYear,
      };
    });
  };

  const isNextDisabled =
    selectedMonth.selectedYear === new Date().getFullYear() &&
    selectedMonth.selectedMonth === new Date().getMonth();

  return (
    <View className="flex flex-row justify-between w-full gap-48">
      <View className="flex flex-row justify-around items-center gap-3">
        {/* Previous Month Button */}
        <TouchableOpacity onPress={() => handleMonthChange("prev")}>
          <Icon name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>

        {/* Current Month and Year Display */}
        <Text>
          {months[selectedMonth.selectedMonth]} {selectedMonth.selectedYear}
        </Text>

        {/* Next Month Button */}
        <TouchableOpacity
          onPress={() => handleMonthChange("next")}
          disabled={isNextDisabled}
        >
          <Icon
            name="chevron-right"
            size={28}
            color={isNextDisabled ? "#ccc" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Icon */}
      <View className="flex flex-row items-center">
        <TouchableOpacity
          onPress={() =>
            setSelectedMonth((prev) => ({
              ...prev,
              showFilteringModel: true,
            }))
          }
        >
          <View className="px-4 flex flex-row items-center">
            <Icons name="sliders" size={22} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionMainHeader;
