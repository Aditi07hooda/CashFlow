import { View, Text, Image } from "react-native";
import React from "react";
import { categoryFunc } from "../assets/category";

const TransactionCategory = ({ categoryName, size, total }) => {
  const img = categoryFunc(categoryName);
  return (
    <View className="flex flex-row justify-between px-4 py-3 items-center bg-[#d4eff1] rounded-xl">
      <View className="flex flex-row gap-5 items-center">
        <View className="rounded-full bg-[#f87171] p-2">
          <Image source={img} resizeMode="contain" className="h-10 w-10" />
        </View>
        <View>
          <Text className="text-lg font-bold font-mono leading-snug tracking-wider">
            {categoryName}
          </Text>
          <Text className="text-gray-500 text-sm font-mono leading-snug tracking-wider">
            {size || 0} Transactions
          </Text>
        </View>
      </View>
      <View>
        <Text className="text-lg font-bold font-mono leading-snug tracking-wider">
          - Rs. {total}
        </Text>
      </View>
    </View>
  );
};

export default TransactionCategory;
