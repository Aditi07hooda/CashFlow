import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient"; // Import from expo-linear-gradient

const CustomBar = ({ value, label, height, frontColor, gradientColor }) => {
  const [showValue, setShowValue] = useState(false);

  return (
    <TouchableOpacity onPress={() => setShowValue(!showValue)}>
      <View style={{ alignItems: "center" }}>
        {showValue && (
          <Text className="text-xs mb-1 text-gray-500">Rs. {value}</Text>
        )}
        <LinearGradient
          colors={["#4CAF50", "#8BC34A"]}
          start={[0, 0]}
          end={[0, 1]}
          style={{
            height: height,
            width: 20,
            borderRadius: 8,
            marginHorizontal: 5,
          }}
        />
        <Text style={{ marginTop: 5 }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomBar;