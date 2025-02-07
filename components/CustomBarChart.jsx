import { View, Text, ScrollView } from "react-native";
import React from "react";
import CustomBar from "./CustomBar";

const CustomBarChart = ({ prepareChartData, MAX_Y_AXIS_VALUE, CHART_HEIGHT }) => {
  return (
    <View className="flex flex-row mt-10">
      {/* Fixed Y-Axis */}
      <View className="mr-3">
        {Array.from({ length: 11 }, (_, index) => {
          const label = MAX_Y_AXIS_VALUE - index * 1000;
          return (
            <Text
              key={label}
              className="text-gray-500 text-sm h-[30px] text-right"
              style={{
                height: CHART_HEIGHT / 10,
              }}
            >
              {label / 1000}k
            </Text>
          );
        })}
      </View>

      {/* Scrollable X-Axis */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row items-end">
          {prepareChartData().map((item, index) => (
            <CustomBar
              key={index}
              value={item.value}
              label={item.label}
              height={item.height}
              frontColor={item.frontColor}
              gradientColor={item.gradientColor}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomBarChart;