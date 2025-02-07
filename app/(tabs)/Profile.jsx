import React, { useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDate } from "@/scripts/analytics";
import { router, useFocusEffect } from "expo-router";
import icons from "@/assets/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from "expo-constants";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const Profile = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    selectDateRange: {
      minDate: new Date(new Date().getFullYear(), 0, 1),
      maxDate: new Date(new Date().getFullYear(), 11, 31),
    },
    user: {},
  });

  const getMyself = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const email = await AsyncStorage.getItem("email");
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;

      const res = await fetch(
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

      if (!res.ok) {
        throw new Error("error fetching transaction in range");
      }

      const data = await res.json();

      setState((prev) => ({
        ...prev,
        username: username,
        email: email,
        user: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/(auth)/Signin");
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMyself();
    }, [])
  );

  return (
    <SafeAreaView className="h-full bg-gray-100">
      {/* Header */}
      <View className="bg-[#a5f3fc] p-4 rounded-b-3xl">
        <TouchableOpacity onPress={() => logout()}>
          <View className="absolute top-2 right-1 z-50">
            <Icon name="logout" size={28} color="#f87171" />
          </View>
        </TouchableOpacity>
        <View className="flex items-center">
          <Image
            source={icons.UserProfileImage}
            className="h-24 w-24 rounded-full border-4 border-black"
          />
          <Text className="text-2xl font-bold mt-3">
            {state.username || "Guest User"}
          </Text>
          <Text className="text-sm">
            {state.email || "Email not available"}
          </Text>
        </View>
      </View>

      {/* Profile Details */}
      <View className="bg-white mx-4 mt-6 p-4 rounded-lg shadow">
        <Text className="text-lg font-semibold text-gray-800">
          Account Details
        </Text>
        <View className="mt-3">
          <View className="flex flex-row justify-between py-2 border-b">
            <Text className="text-gray-600">Username:</Text>
            <Text className="text-gray-800 font-medium">{state.username}</Text>
          </View>
          <View className="flex flex-row justify-between py-2 border-b">
            <Text className="text-gray-600">Email:</Text>
            <Text className="text-gray-800 font-medium">{state.email}</Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text className="text-gray-600">Member Since:</Text>
            <Text className="text-gray-800 font-medium">
              {state.user?.user?.createdAt || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Additional Info (Optional) */}
      <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow">
        <Text className="text-lg font-semibold text-gray-800">Preferences</Text>
        <View className="mt-3">
          <View className="flex flex-row justify-between py-2 border-b">
            <Text className="text-gray-600">Preferred Language:</Text>
            <Text className="text-gray-800 font-medium">
              {state.user?.language || "English"}
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text className="text-gray-600">Time Zone:</Text>
            <Text className="text-gray-800 font-medium">
              {state.user?.timezone || "IN"}
            </Text>
          </View>
        </View>
      </View>

      {/* Money detail */}
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
    </SafeAreaView>
  );
};

export default Profile;
