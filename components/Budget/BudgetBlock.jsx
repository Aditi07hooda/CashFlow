import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/Entypo";
import { categoryFunc } from "../../assets/category";
import AddBudget from "./AddBudget";
import ProgressBar from "../ProgressBar";
import { fetchTransaction } from "@/scripts/analytics";

const BudgetBlock = ({ budget }) => {
  const [state, setState] = useState({
    budget: budget,
    showAddBudget: false,
    showCategoryProgress: false,
    transactions: [],
    selectDateRange: {
      minDate: new Date(budget.startDate),
      maxDate: new Date(budget.endDate),
    },
    transactionType: "EXPENSE",
  });

  const calculateCategorySpend = (transactions, budget) => {
    const { startDate, endDate, categories } = budget;

    const categorySpend = {};
    categories.forEach((category) => {
      categorySpend[category.categoryName] = 0;
    });

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      return (
        transactionDate >= new Date(startDate) &&
        transactionDate <= new Date(endDate)
      );
    });

    filteredTransactions.forEach((transaction) => {
      const categoryName = transaction.category?.categoryName;
      if (categorySpend.hasOwnProperty(categoryName)) {
        categorySpend[categoryName] += transaction.amount;
      }
    });
    const totalSpend = Object.values(categorySpend).reduce(
      (total, amount) => total + amount,
      0
    );

    console.log("category spend object - ", categorySpend);
    console.log("Total spend - ", totalSpend);

    return { categorySpend, totalSpend };
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransaction(state, setState);
    }, [state.budget.startDate, state.budget.endDate])
  );

  const { categorySpend, totalSpend } = calculateCategorySpend(
    state.transactions,
    state.budget
  );

  return (
    <View>
      {/* Budget Block */}
      <View className="bg-white p-4 mt-2 rounded-lg shadow-md">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-800">
            Rs. {budget.budget}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setState((prev) => ({ ...prev, showAddBudget: true }))
            }
          >
            <Icon name="edit" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        {budget.description && (
          <Text className="text-gray-600 mt-2">{budget.description}</Text>
        )}

        {/* Dates */}
        <View className="flex-row justify-between mt-2">
          <Text className="text-sm text-gray-500">
            Start: {budget.startDate}
          </Text>
          <Text className="text-sm text-gray-500">End: {budget.endDate}</Text>
        </View>
        <Text className="text-sm text-gray-500 mb-4">
          Period: {budget.period}
        </Text>

        {/* Categories Button */}
        <TouchableOpacity
          onPress={() =>
            setState((prev) => ({ ...prev, showCategoryProgress: true }))
          }
        >
          <ProgressBar totalAmount={budget.budget} usedAmount={totalSpend} />
        </TouchableOpacity>
      </View>

      {/* Categories Modal */}
      {state.showCategoryProgress && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-gray-900/50">
            <View className="bg-white rounded-lg px-4 pt-4 mt-4 w-11/12">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-800">
                  Category Progress
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setState((prev) => ({
                      ...prev,
                      showCategoryProgress: false,
                    }))
                  }
                >
                  <Icons name="cross" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Categories List */}
              <FlatList
              className="mb-3 pb-3"
                data={Object.entries(categorySpend)
                  .map(([categoryName, amount]) => ({
                    categoryName,
                    amount,
                    percentage:
                      totalSpend > 0 ? (amount / totalSpend) * 100 : 0,
                  }))
                  .sort((a, b) => b.amount - a.amount)}
                keyExtractor={(item) => item.categoryName}
                renderItem={({ item }) => {
                  const usedAmount = categorySpend[item.categoryName] || 0;
                  return (
                    <View className="bg-gray-200 mb-2 rounded-md px-4 flex-row items-center">
                      {/* Icon */}
                      <Image
                        resizeMode="contain"
                        className="h-8 w-8 mr-4"
                        source={categoryFunc(item.categoryName)}
                      />
                      {/* Category Info */}
                      <View className="flex-1">
                        <Text className="text-sm text-gray-700">
                          {item.categoryName || "Unnamed Category"}
                        </Text>
                        <ProgressBar
                          totalAmount={budget.budget}
                          usedAmount={usedAmount}
                        />
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Add Budget Modal */}
      {state.showAddBudget && (
        <Modal transparent animationType="slide">
          <AddBudget stateVisibility={state} setStateVisibility={setState} />
        </Modal>
      )}
    </View>
  );
};

export default BudgetBlock;
