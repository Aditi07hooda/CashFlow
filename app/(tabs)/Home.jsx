import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import PieChartUI from "../../components/PieChartUI";
import TransactionCategory from "../../components/TransactionCategory";
import AddButton from "../../components/AddButton";
import AddTransaction from "../../components/Transactions/AddTransaction";
import Constants from "expo-constants";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;
const Home = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    trasactionByCategory: {},
    showAddTransaction: false,
    trans: null,
  });

  const getMyself = async () => {
    try {
      const name = await AsyncStorage.getItem("username");
      const email = await AsyncStorage.getItem("email");
      setState((prev) => ({
        ...prev,
        username: name,
        email: email,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowAddTransactions = () => {
    setState((prev) => ({ ...prev, showAddTransaction: true }));
  };

  const fetchAllCategroyByExpense = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");
      const res = await fetch(
        `${BACKEND}/category/all/spending?username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("error fetching category");
      }
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        trasactionByCategory: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMyself();
      fetchAllCategroyByExpense();
    }, [])
  );

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="m-5">
          <View className="flex gap-2">
            <Text className="text-3xl font-extrabold font-mono text-left tracking-wide leading-snug">
              Hello, {state.username}
            </Text>
            <Text className="text-base font-normal font-mono text-left tracking-wide leading-snug">
              Welcome back
            </Text>
          </View>
          <View className="my-5">
            <PieChartUI />
          </View>
          <View>
            <Text className="text-lg font-bold font-mono text-left tracking-wide leading-snug">
              Spending of the month
            </Text>
            <View className="flex gap-2 mt-5">
              {Object.keys(state.trasactionByCategory).length > 0 &&
                Object.entries(state.trasactionByCategory)?.map(
                  ([category, value]) =>
                    value.size > 0 && (
                      <TransactionCategory
                        key={category}
                        categoryName={value?.categoryName}
                        size={value?.size}
                        total={value?.total}
                      />
                    )
                )}
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleShowAddTransactions}>
        <View className="absolute bottom-10 right-4 z-50">
          <AddButton />
        </View>
      </TouchableOpacity>
      {state.showAddTransaction && (
        <Modal transparent={true} animationType="slide">
          <AddTransaction
            stateVisibility={state}
            setStateVisibility={setState}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Home;
