import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ title, onClick, style }) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <View className={`text-center bg-[#f87171] rounded-lg w-fit mx-5 ${style}`}>
        <Text className="text-center font-semibold text-lg w-fit py-2 px-5">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
