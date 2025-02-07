import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { formatDate } from "@/scripts/analytics";
import { useFocusEffect } from "expo-router";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const TransactionStatistics = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    selectDateRange: {
      minDate: new Date(new Date().getFullYear(), 0, 1), // Year start
      maxDate: new Date(new Date().getFullYear(), 11, 31), // Year end
    },
    currentMonthRange: {
      minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Month start
      maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // Month end
    },
    user: {},
    currentMonth: {},
  });

  const getMyself = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const email = await AsyncStorage.getItem("email");
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;

      // Fetch Yearly Summary
      const resYearly = await fetch(
        `${BACKEND}/myaccount?username=${username}&minDateControl=${formatDate(
          state.selectDateRange.minDate
        )}&maxDateControl=${formatDate(state.selectDateRange.maxDate)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!resYearly.ok) {
        throw new Error("Error fetching yearly transaction data");
      }

      const dataYearly = await resYearly.json();

      // Fetch Monthly Summary
      const resMonthly = await fetch(
        `${BACKEND}/myaccount?username=${username}&minDateControl=${formatDate(
          state.currentMonthRange.minDate
        )}&maxDateControl=${formatDate(state.currentMonthRange.maxDate)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!resMonthly.ok) {
        throw new Error("Error fetching monthly transaction data");
      }

      const dataMonthly = await resMonthly.json();

      setState((prev) => ({
        ...prev,
        username: username,
        email: email,
        user: dataYearly,
        currentMonth: dataMonthly,
      }));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const downloadPDF = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;

      const res = await fetch(
        `${BACKEND}/transactions/downloadPDFFile?username=${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error downloading transactions");
      }

      console.log("Downloading PDF...");

      // Get the response as a Blob
      const blob = await res.blob();

      // Request permissions to access storage
      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        Alert.alert("Permission denied", "Cannot access storage.");
        return;
      }

      const fileName = "transactions.pdf";

      // Create a file and write the blob to it
      const uri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        "application/pdf"
      );
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1]; // Extract base64 data from the URL
        await FileSystem.writeAsStringAsync(uri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        Alert.alert("Success", "Transactions downloaded successfully.");
        console.log("PDF downloaded successfully at: ", uri);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not download transactions.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMyself();
    }, [])
  );

  return (
    <View className="mt-4">
      {/* Header */}
      <View className="flex flex-row justify-between w-full bg-[#d4eff1] py-4 rounded-lg px-4">
        <Text className="text-lg font-bold">Statistics</Text>
        <TouchableOpacity onPress={downloadPDF}>
          <Icon name="download" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Monthly Financial Summary */}
      <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow">
        <Text className="text-lg font-semibold text-gray-800">
          Current Month Financial Summary
        </Text>
        <View className="mt-3">
          <View className="flex flex-row justify-between py-2 border-b">
            <Text className="text-gray-600">Total Monthly Income:</Text>
            <Text className="text-gray-800 font-medium">
              Rs. {state.currentMonth?.totalIncome || 0}
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text className="text-gray-600">Total Monthly Expense:</Text>
            <Text className="text-gray-800 font-medium">
              Rs. {state.currentMonth?.totalExpense || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Yearly Financial Summary */}
      <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow">
        <Text className="text-lg font-semibold text-gray-800">
          Yearly Financial Summary
        </Text>
        <View className="mt-3">
          <View className="flex flex-row justify-between py-2 border-b">
            <Text className="text-gray-600">Total Yearly Income:</Text>
            <Text className="text-gray-800 font-medium">
              Rs. {state.user?.totalIncome || 0}
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text className="text-gray-600">Total Yearly Expense:</Text>
            <Text className="text-gray-800 font-medium">
              Rs. {state.user?.totalExpense || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransactionStatistics;
