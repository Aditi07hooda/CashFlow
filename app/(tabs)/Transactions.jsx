import { View, Text, ScrollView, Modal, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import TransactionTabHeader from "@/components/Transactions/TransactionTabHeader";
import TransactionMainHeader from "@/components/Transactions/TransactionMainHeader";
import TransactionBlock from "@/components/Transactions/TransactionBlock";
import TransactionDateHeader from "@/components/Transactions/TransactionDateHeader";
import TransactionStatistics from "@/components/Transactions/TransactionStatistics";
import TransactionBudget from "@/components/Budget/TransactionBudget";
import TransactionsNote from "@/components/Transactions/TransactionsNote";
import { useFocusEffect } from "expo-router";
import { fetchTransaction, formatDate } from "@/scripts/analytics";
import FilteringModel from "@/components/FilteringModel";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const Transactions = () => {
  const tabs = ["Daily", "Monthly", "Budget", "Stats", "Note"];
  const [state, setState] = useState({
    transactions: [],
    selectedTab: "Daily",
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    selectDateRange: {
      minDate: new Date(),
      maxDate: new Date(),
    },
    transactionType: "ALL",
    selectedDate: formatDate(new Date()),
    showFilteringModel: false,
    isSwiping: false,
  });

  // calculate date ranges
  const calculateDateRange = () => {
    const { selectedTab, selectedMonth, selectedYear } = state;

    if (selectedTab === "Daily") {
      // Function to check if date string is valid and convert it
      const isValidDate = (dateStr) => {
        const parts = dateStr.split("/"); // Split by "/"
        if (parts.length !== 3) return false; // Ensure it has 3 parts (MM, DD, YYYY)

        const month = parseInt(parts[0], 10) - 1; // JavaScript months are 0-11
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const date = new Date(year, month, day);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        );
      };

      const date = isValidDate(state.selectedDate)
        ? new Date(state.selectedDate.split("/").reverse().join("-"))
        : new Date();

      return {
        minDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        maxDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      };
    }

    if (selectedTab === "Monthly") {
      return {
        minDate: new Date(selectedYear, selectedMonth, 1),
        maxDate: new Date(selectedYear, selectedMonth + 1, 0),
      };
    }

    if (selectedTab === "Yearly") {
      return {
        minDate: new Date(selectedYear, 0, 1),
        maxDate: new Date(selectedYear, 11, 31),
      };
    }

    return {
      minDate: new Date(selectedYear, selectedMonth, 1),
      maxDate: new Date(selectedYear, selectedMonth + 1, 0),
    };
  };

  const handleDateChange = (date) => {
    setState((prev) => ({ ...prev, selectedDate: date }));
  };

  const handleSwipe = (event) => {
    const { translationX } = event.nativeEvent;

    if (state.isSwiping) return;

    if (translationX < -50) {
      // Swipe left -> Next tab
      setState((prev) => ({ ...prev, isSwiping: true }));
      setState((prev) => {
        const currentIndex = tabs.indexOf(prev.selectedTab);
        const nextIndex = (currentIndex + 1) % tabs.length; // Wrap around
        return { ...prev, selectedTab: tabs[nextIndex] };
      });
    }

    if (translationX > 50) {
      // Swipe right -> Previous tab
      setState((prev) => ({ ...prev, isSwiping: true }));
      setState((prev) => {
        const currentIndex = tabs.indexOf(prev.selectedTab);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length; // Wrap around
        return { ...prev, selectedTab: tabs[prevIndex] };
      });
    }
  };

  const handleSwipeEnd = () => {
    setState((prev) => ({
      ...prev,
      isSwiping: false,
    }));
  };

  const handleBackPress = useCallback(() => {
    if (state.showFilteringModel) {
      // Close the modal if it is open
      setState((prev) => ({ ...prev, showFilteringModel: false }));
      return true; // Prevent the default back button action
    }
    return false; // Allow the default back button action
  }, [state.showFilteringModel]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, [handleBackPress]);

  useEffect(() => {
    const newDateRange = calculateDateRange();
    setState((prev) => ({
      ...prev,
      selectDateRange: newDateRange,
    }));
  }, [state.selectedTab, state.selectedMonth, state.selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchTransaction(state, setState);
    }, [state.selectDateRange, state.transactionType, state.selectedDate])
  );

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={handleSwipe} onEnded={handleSwipeEnd}>
        <SafeAreaView className="h-full">
          <View className="m-2">
            {/* Header: Month display, search, filter */}
            <View className="flex flex-row justify-between items-center">
              <TransactionMainHeader
                selectedMonth={state}
                setSelectedMonth={setState}
              />
            </View>

            {/* Tabs for daily, monthly, calendar, total, note */}
            <View className="flex flex-row justify-between items-center mt-4">
              <TransactionTabHeader
                selectedTab={state}
                setSelectedTab={setState}
              />
            </View>

            {/* Transaction date header */}
            {(state.selectedTab === "Daily" ||
              state.selectedTab === "Monthly") && (
              <View className="flex flex-row justify-between items-center mt-4">
                <TransactionDateHeader
                  selectedTab={state.selectedTab}
                  onDateChange={handleDateChange}
                />
              </View>
            )}

            {/* budget tab */}
            {state.selectedTab === "Budget" && <TransactionBudget />}

            {/* Block for transaction representation */}
            {(state.selectedTab === "Daily" ||
              state.selectedTab === "Monthly") && (
              <View className="mt-4" style={{ maxHeight: "77%" }}>
                <ScrollView className="space-y-3 ">
                  {state.transactions.length > 0 ? (
                    state.transactions.map((trans, index) => (
                      <TransactionBlock
                        key={trans.id}
                        transaction={trans}
                        month={state.selectedMonth}
                        selectedTab={state.selectedTab}
                        style={
                          index % 2 !== 0 ? "bg-[#f0eaea]" : "bg-[#e3eff0]"
                        }
                      />
                    ))
                  ) : (
                    <View className="flex justify-center items-center h-20">
                      <Text className="text-gray-500">No transactions</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            {state.selectedTab === "Stats" && <TransactionStatistics />}
            {state.selectedTab === "Note" && <TransactionsNote />}

            {/* filtering modal */}
            {state.showFilteringModel && (
              <Modal transparent={true} animationType="slide" visible={state.showFilteringModel}>
                <FilteringModel state={state} setState={setState} />
              </Modal>
            )}
          </View>
        </SafeAreaView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Transactions;
