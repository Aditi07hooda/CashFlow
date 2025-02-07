import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useCallback, useState } from "react";
import { formatDate } from "../../scripts/analytics";
import Constants from "expo-constants";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "react-native-ui-datepicker";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const TransactionDateHeader = ({ selectedTab, onDateChange }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  const [state, setState] = useState({
    date: formatDate(new Date()),
    day: new Date().getDay(),
    totalIncome: 0,
    totalExpense: 0,
    showDatePicker: false,
  });

  const fetchTotalIncome = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");

      const minDate =
        selectedTab === "Monthly"
          ? formatDate(
              new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            )
          : formatDate(new Date());
      const maxDate =
        selectedTab === "Monthly"
          ? formatDate(
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            )
          : formatDate(new Date());

      const res = await fetch(
        `${BACKEND}/income/total?username=${username}&minDateControl=${minDate}&maxDateControl=${maxDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Could not fetch total income.");
      }
      const data = await res.text();
      setState((prev) => ({ ...prev, totalIncome: Number(data) }));
    } catch (error) {
      console.error("Error fetching total income:", error);
    }
  };

  const fetchTotalExpense = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");

      const minDate =
        selectedTab === "Monthly"
          ? formatDate(
              new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            )
          : formatDate(new Date());
      const maxDate =
        selectedTab === "Monthly"
          ? formatDate(
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            )
          : formatDate(new Date());

      const res = await fetch(
        `${BACKEND}/spent/total?username=${username}&minDateControl=${minDate}&maxDateControl=${maxDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Could not fetch total expenses.");
      }
      const data = await res.text();
      setState((prev) => ({ ...prev, totalExpense: Number(data) }));
    } catch (error) {
      console.error("Error fetching total expenses:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTotalIncome();
      fetchTotalExpense();
    }, [selectedTab])
  );

  const handleDateChange = (date) => {
    const validDate = new Date(date);
    if (!isNaN(validDate.getTime())) {
      const formattedDate = formatDate(validDate);
      setState((prev) => ({
        ...prev,
        date: formattedDate,
        day: validDate.getDay(),
        showDatePicker: false,
      }));
      onDateChange(formattedDate);
    } else {
      console.error("Invalid date selected:", date);
    }
  };

  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const date = isValidDate(state.date) ? new Date(state.date) : new Date();

  return (
    <View className="flex flex-row justify-between items-center bg-[#f0eaea] px-4 py-2 rounded-md shadow-sm w-full">
      {/* Date and Day */}
      <TouchableOpacity
        onPress={() => {
          if (selectedTab === "Daily") {
            setState((prev) => ({
              ...prev,
              showDatePicker: true,
            }));
          }
        }}
      >
        <View className="flex flex-col">
          <Text className="text-base font-semibold text-gray-800">
            {selectedTab === "Monthly"
              ? months[new Date().getMonth()]
              : state.date}
          </Text>
          <Text className="text-sm text-gray-500">
            {selectedTab === "Daily" && days[state.day]}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Income and Expense */}
      <View className="flex flex-row items-center gap-4">
        <View className="flex flex-col items-end">
          <Text className="text-sm text-blue-700">Income</Text>
          <Text className="text-base font-semibold text-blue-700">
            Rs. {state.totalIncome}
          </Text>
        </View>
        <View className="flex flex-col items-end">
          <Text className="text-sm text-red-700">Expense</Text>
          <Text className="text-base font-semibold text-red-700">
            Rs. {state.totalExpense}
          </Text>
        </View>
      </View>

      {state.showDatePicker && (
        <Modal transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-5 rounded-lg shadow-lg">
              <DateTimePicker
                mode="single"
                date={date}
                onChange={({ date }) => handleDateChange(date)}
                todayContainerStyle="rounded-full"
                todayTextStyle="text-black font-bold"
                selectedItemColor="#f87171"
                selectedTextStyle="text-white font-bold"
                maxDate={new Date()}
              />
              <TouchableOpacity
                onPress={() =>
                  setState((prev) => ({ ...prev, showDatePicker: false }))
                }
                className="mt-4 bg-red-500 py-3 rounded-md"
              >
                <Text className="text-white text-center text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default TransactionDateHeader;
