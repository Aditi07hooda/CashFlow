import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { categoryFunc } from "../../assets/category";
import AddTransaction from "./AddTransaction";

const TransactionBlock = ({ transaction, month, selectedTab, style }) => {
  const img = categoryFunc(transaction.category.categoryName);

  const [state, setState] = useState({
    showAddTransaction: false,
    trans: transaction,
  });

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          setState((prev) => ({ ...prev, showAddTransaction: true }))
        }
      >
        <View className={`flex flex-row justify-between px-4 py-3 items-center rounded-xl w-full mt-2 ${style}`}>
          <View className="flex flex-row gap-5 items-center">
            <View className="rounded-full bg-[#f87171] p-2">
              <Image source={img} resizeMode="contain" className="h-8 w-8" />
            </View>
            <View>
              <Text className="text-lg font-bold font-mono leading-snug tracking-wider">
                {transaction.category.categoryName}
              </Text>
            </View>
          </View>
          <View className="flex items-center">
            <Text className="text-[15px] font-semibold font-mono leading-snug tracking-wider text-gray-500">
              {transaction.accountType}
            </Text>
            {month !== new Date().getMonth() && selectedTab !== "Daily" && (
              <Text className="text-sm font-semibold font-mono leading-snug tracking-wider text-gray-500">
                {month !== new Date().getMonth() && transaction.transactionDate}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-lg font-bold font-mono leading-snug tracking-wider text-blue-500">
              Rs.{" "}
              {transaction.transactionType === "INCOME"
                ? transaction.amount
                : 0}
            </Text>
          </View>
          <View>
            <Text className="text-lg font-bold font-mono leading-snug tracking-wider text-red-600">
              - Rs.{" "}
              {transaction.transactionType === "EXPENSE"
                ? transaction.amount
                : 0}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View>
        {state.showAddTransaction && (
          <Modal transparent={true} animationType="slide">
            <AddTransaction
              stateVisibility={state}
              setStateVisibility={setState}
            />
          </Modal>
        )}
      </View>
    </View>
  );
};

export default TransactionBlock;
