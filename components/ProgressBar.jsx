import React from "react";
import { View, Text } from "react-native";

const ProgressBar = ({ totalAmount, usedAmount }) => {
  const percentage = Math.min((usedAmount / totalAmount) * 100, 100);

  let progressColor;
  if (percentage <= 50) {
    progressColor = "bg-green-500";
  } else if (percentage <= 80) {
    progressColor = "bg-yellow-500";
  } else {
    progressColor = "bg-red-500";
  }

  return (
    <View className="w-full">
      <View className="h-4 bg-gray-300 rounded-full overflow-hidden">
        <View
          className={`h-full ${progressColor}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
      <Text className="mt-2 text-xs text-gray-400">
        {`Used: Rs. ${usedAmount} / Total: Rs. ${totalAmount} (${percentage.toFixed(2)}%)`}
      </Text>
    </View>
  );
};

export default ProgressBar;
