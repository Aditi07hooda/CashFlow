import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { PieChart } from "react-native-gifted-charts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { formatDate } from "@/scripts/analytics";
import Constants from "expo-constants";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const PieChartUI = () => {
  const [state, setState] = useState({
    totalIncome: 0,
    totalExpense: 0,
  });

  const fetchTotalIncome = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");
      const minDate = formatDate(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      );
      const maxDate = formatDate(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      );

      const res = await fetch(
        `${BACKEND}/income/total?username=${username}&minDateControl=${minDate}&maxDateControl=${maxDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("cound not found url fetching");
      }
      const data = await res.text();
      setState((prev) => ({ ...prev, totalIncome: Number(data) }));
    } catch (error) {
      console.error("error fetching total income: ", error);
    }
  };

  const fetchTotalExpense = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");
      const minDate = formatDate(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      );
      const maxDate = formatDate(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      );

      const res = await fetch(
        `${BACKEND}/spent/total?username=${username}&minDateControl=${minDate}&maxDateControl=${maxDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("cound not found url fetching");
      }
      const data = await res.text();
      setState((prev) => ({ ...prev, totalExpense: Number(data) }));
    } catch (error) {
      console.error("error fetching total income: ", error);
    }
  };

  const pieData = [
    {
      value: state.totalExpense,
      color: "#009FFF",
      gradientCenterColor: "#006DFF",
      focused: true,
    },
    {
      value: state.totalIncome,
      color: "#f87171",
      gradientCenterColor: "#f87171",
    },
  ];

  useFocusEffect(
    useCallback(() => {
      fetchTotalIncome();
      fetchTotalExpense();
    }, [])
  );

  return (
    <TouchableOpacity onPress={() => router.push("/(tabs)/Analytics")}>
      <View className="flex flex-row py-3 rounded-3xl px-3 bg-[#a5f3fc] justify-between">
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={50}
          innerRadius={30}
          innerCircleColor={"#a5f3fc"}
          centerLabelComponent={() => {
            return (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 12, color: "black" }}>
                  {((state.totalExpense / state.totalIncome) * 100).toFixed(2)}{" "}
                  %
                </Text>
              </View>
            );
          }}
        />
        <View className="flex gap-2 w-fit flex-wrap justify-center">
          <Text className="w-fit text-gray-500 text-xl font-mono leading-snug tracking-wider">
            My Balance
          </Text>
          <Text className="text-2xl font-bold font-mono leading-snug tracking-wider">
            Rs. {state.totalIncome - state.totalExpense}
          </Text>
        </View>
        <View className="flex gap-2 w-fit flex-wrap justify-center">
          <Icon
            name="arrow-up-right"
            size={20}
            color={"white"}
            className="bg-[#f87171] rounded-full p-3 font-bold"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PieChartUI;
