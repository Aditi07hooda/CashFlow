import { View, Text } from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { PieChart } from "react-native-gifted-charts";
import { formatDate } from "@/scripts/analytics";
import Constants from "expo-constants";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const AnalyticsDay = ({ dates }) => {
  const [state, setState] = useState({
    totalIncome: 0,
    totalExpense: 0,
  });

  const fetchTotalIncome = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");
      const res = await fetch(
        `${BACKEND}/income/total?username=${username}&minDateControl=${formatDate(
          dates.minDate
        )}&maxDateControl=${formatDate(dates.maxDate)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("could not find URL fetching");
      }
      const data = await res.text();

      const cleanedData = data.trim().replace(/[^0-9.-]+/g, "");
      const parsedValue = Number(cleanedData);

      // if (parsedValue > 0) {
      //   setState((prev) => ({ ...prev, totalIncome: parsedValue }));
      // }else {
      //   setState((prev) => ({ ...prev, totalIncome: 0 }));
      // }
    } catch (error) {
      console.error("Error fetching total income: ", error);
    }
  };

  const fetchTotalExpense = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");

      const res = await fetch(
        `${BACKEND}/spent/total?username=${username}&minDateControl=${formatDate(
          dates.minDate
        )}&maxDateControl=${formatDate(dates.maxDate)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("could not find URL fetching");
      }
      const data = await res.text();

      const cleanedData = data.trim().replace(/[^0-9.-]+/g, "");
      const parsedValue = Number(cleanedData);

      // if (parsedValue > 0) {
      //   setState((prev) => ({ ...prev, totalIncome: parsedValue }));
      // }else {
      //   setState((prev) => ({ ...prev, totalExpense: 0 }));
      // }
    } catch (error) {
      console.error("Error fetching total expense: ", error);
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
    }, [dates, state.totalIncome, state.totalExpense])
  );

  useEffect(() => {
    fetchTotalIncome();
    fetchTotalExpense();
  }, [dates, state.totalIncome, state.totalExpense]);

  console.log("Total Income:", state.totalIncome);
  console.log("Total Expense:", state.totalExpense);
  console.log("Pie Data:", pieData);

  return (
    <View>
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
                  {state.totalIncome !== 0
                    ? ((state.totalExpense / state.totalIncome) * 100).toFixed(
                        2
                      )
                    : 0}
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
      </View>
    </View>
  );
};

export default AnalyticsDay;
