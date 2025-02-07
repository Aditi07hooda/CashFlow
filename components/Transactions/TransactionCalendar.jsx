import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "expo-router";
import { fetchTransaction } from "../../scripts/analytics";
import Icon from "react-native-vector-icons/FontAwesome";

const TransactionCalendar = () => {
  const currentDate = new Date();
  const [state, setState] = useState({
    transactions: [],
    transactionType: "ALL",
    loading: false,
    selectDateRange: {
      minDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      maxDate: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ),
    },
    markedDates: {},
    currentMonth: `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-01`,
    selectDate: null,
    displayTransaction: [],
  });

  const [transactionsFetched, setTransactionsFetched] = useState(false);

  const updateDateRange = (month) => {
    const minDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const maxDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    setState((prevState) => ({
      ...prevState,
      selectDateRange: { minDate, maxDate },
    }));
  };

  const fetchTransactions = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    fetchTransaction(state, setState);
    setTransactionsFetched(true);
    setState((prevState) => ({
      ...prevState,
      loading: false,
    }));
  }, [state.selectDateRange]);

  const updateMarkedDates = (transactions) => {
    const marked = {};
    transactions.forEach((transaction) => {
      const formattedDate = new Date(transaction.transactionDate)
        .toISOString()
        .split("T")[0];
      marked[formattedDate] = { marked: true, dotColor: "red" };
    });
    setState((prevState) => ({ ...prevState, markedDates: marked }));
  };

  const onDayPress = (day) => {
    const transaction = state.transactions.filter(
      (trans) => trans.transactionDate === day.dateString
    );
    setState((prevState) => ({
      ...prevState,
      selectDate: day.dateString,
      displayTransaction: transaction,
    }));
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(state.selectDateRange.minDate);
    newMonth.setMonth(newMonth.getMonth() + direction);
    updateDateRange(newMonth);
    setState((prevState) => ({
      ...prevState,
      currentMonth: `${newMonth.getFullYear()}-${String(
        newMonth.getMonth() + 1
      ).padStart(2, "0")}-01`,
    }));
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [fetchTransactions])
  );

  useEffect(() => {
    if (transactionsFetched) {
      updateMarkedDates(state.transactions);
      setTransactionsFetched(false);
    }
  }, [transactionsFetched, state.transactions]);

  console.log(state);

  return (
    <View className="flex-1 p-4">
      {state.loading ? (
        <ActivityIndicator size="large" color="#f87171" />
      ) : (
        <View>
          <Calendar
            current={state.currentMonth}
            onDayPress={onDayPress}
            markedDates={state.markedDates}
            theme={{
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "#2d4150",
              arrowColor: "#00adf5",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={{
              borderWidth: 1,
              borderColor: "gray",
              height: 350,
            }}
            renderArrow={(direction) => (
              <TouchableOpacity
                onPress={() => changeMonth(direction === "left" ? -1 : 1)}
                className="p-2"
              >
                <Icon
                  name={direction === "left" ? "chevron-left" : "chevron-right"}
                  size={18}
                  color="#000"
                />
              </TouchableOpacity>
            )}
          />
          {state.selectDate && (
            <View className="mt-4">
              <Text className="text-lg font-bold">
                Selected Date: {state.selectDate}
              </Text>
              {state.displayTransaction.map((trans, index) => (
                <View key={index} className="mt-2">
                  <Text className="text-sm text-gray-500">
                    ₹{trans.amount} - {trans.category.categoryName}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TransactionCalendar;