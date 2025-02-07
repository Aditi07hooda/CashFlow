import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  fetchTransaction,
  changeDateOptions,
  changeDate,
  formatDate,
} from "../../scripts/analytics";
import { useFocusEffect } from "expo-router";
import CustomBarChart from "@/components/CustomBarChart";
import AnalyticsDay from "@/components/AnalyticsDay";

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

const CHART_HEIGHT = 200;
let MAX_Y_AXIS_VALUE = 10000;

const Analytics = () => {
  const [selectedDateRange, setSelectedDateRange] = useState("Day");
  const [state, setState] = useState({
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    selectDateRange: {
      minDate: new Date(),
      maxDate: new Date(),
    },
    selectedDateType: "Month",
    transactions: [],
    transactionType: "Expense",
    showFilteringModel: false,
  });

  useFocusEffect(
    useCallback(() => {
      fetchTransaction(state, setState);
    }, [state.selectDateRange, state.transactionType])
  );

  const changeTransactionType = (transactionType) => {
    setState((prev) => ({ ...prev, transactionType: transactionType }));
  };

  useEffect(() => {
    fetchTransaction(state, setState);
  }, [state.selectDateRange, state.transactionType]);

  const handleChangeDateOptions = (type) => {
    const now = new Date();
    setSelectedDateRange(type);
    changeDateOptions(type, now, setState);
  };

  const handleChangeDate = (direction) => {
    changeDate(direction, state, setState);
  };

  const isSelected = (type) => selectedDateRange === type;
  const isSelectedTransactionType = (type) => state.transactionType === type;

  const prepareChartDataForMonth = () => {
    const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();

    const transactionAmounts = state.transactions.map(
      (transaction) => transaction.amount
    );
    MAX_Y_AXIS_VALUE = Math.max(...transactionAmounts, 10000);

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const dateString = `${state.year}-${String(state.month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const totalAmount = state.transactions
        .filter((transaction) => transaction.transactionDate === dateString)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const height = MAX_Y_AXIS_VALUE
        ? (totalAmount / MAX_Y_AXIS_VALUE) * CHART_HEIGHT
        : 0; // Scale bar height correctly

      return {
        value: totalAmount,
        label: `${day}`,
        height,
        frontColor: "#4CAF50",
        gradientColor: ["#4CAF50", "#8BC34A"],
      };
    });
  };

  const prepareChartDataForYear = () => {
    const transactionAmounts = state.transactions.map(
      (transaction) => transaction.amount
    );
    MAX_Y_AXIS_VALUE = Math.max(...transactionAmounts, 10000); // Update max Y-axis value

    return Array.from({ length: 12 }, (_, index) => {
      const month = index;
      const totalAmount = state.transactions
        .filter(
          (transaction) =>
            new Date(transaction.transactionDate).getFullYear() ===
              state.year &&
            new Date(transaction.transactionDate).getMonth() === month
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const height = MAX_Y_AXIS_VALUE
        ? (totalAmount / MAX_Y_AXIS_VALUE) * CHART_HEIGHT
        : 0; // Scale bar height correctly

      return {
        value: totalAmount,
        label: monthNames[month].slice(0, 3), // Show short month name (e.g., Jan)
        height,
        frontColor: "#4CAF50",
        gradientColor: ["#4CAF50", "#8BC34A"],
      };
    });
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView>
        <View className="m-5">
          {/* Header */}
          <View className="flex flex-row justify-between">
            <Text className="text-xl font-extrabold font-mono tracking-wide leading-snug text-center">
              Analytics
            </Text>
          </View>

          <View className="flex flex-row justify-around mt-5">
            {["Income", "Expense"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => changeTransactionType(type)}
              >
                <View
                  className={`py-2 px-16 rounded-xl ${
                    isSelectedTransactionType(type)
                      ? "bg-[#f87171]"
                      : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      isSelectedTransactionType(type)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {type}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date Range Options */}
          <View className="flex flex-row justify-between mt-5">
            {["Month", "Year"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => handleChangeDateOptions(type)}
              >
                <View
                  className={`py-2 px-10 rounded-xl ${
                    isSelected(type) ? "bg-[#f87171]" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      isSelected(type) ? "text-white" : "text-black"
                    }`}
                  >
                    {type}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date Navigation */}
          <View className="mt-5 flex flex-row justify-around items-center">
            <TouchableOpacity onPress={() => handleChangeDate("prev")}>
              <Icon name="chevron-left" size={28} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-bold">
              {state.selectedDateType === "Day"
                ? formatDate(new Date(state.year, state.month, state.date))
                : state.selectedDateType === "Month"
                ? `${monthNames[state.month]} ${state.year}`
                : state.selectedDateType === "Year"
                ? `${state.year}`
                : ""}
            </Text>
            <TouchableOpacity onPress={() => handleChangeDate("next")}>
              <Icon name="chevron-right" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          {/* {state.selectedDateType === "Day" && (
            <View className="mt-5">
              <AnalyticsDay dates={state.selectDateRange} />
            </View>
          )} */}

          {state.selectedDateType === "Month" && (
            <CustomBarChart
              prepareChartData={prepareChartDataForMonth}
              MAX_Y_AXIS_VALUE={MAX_Y_AXIS_VALUE}
              CHART_HEIGHT={CHART_HEIGHT}
            />
          )}

          {state.selectedDateType === "Year" && (
            <CustomBarChart
              prepareChartData={prepareChartDataForYear}
              MAX_Y_AXIS_VALUE={MAX_Y_AXIS_VALUE}
              CHART_HEIGHT={CHART_HEIGHT}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analytics;
