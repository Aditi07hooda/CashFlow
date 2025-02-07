import { View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const AddButton = () => {
  return (
    <View className="rounded-full p-4 bg-[#f87171]">
      <Icon name="plus" size={20} color="black" />
    </View>
  );
};

export default AddButton;
