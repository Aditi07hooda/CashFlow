import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import React, { useCallback, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BudgetBlock from "./BudgetBlock";
import { useFocusEffect } from "expo-router";
import AddBudget from "./AddBudget";
import Constants from "expo-constants";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const TransactionBudget = () => {
  const [state, setState] = useState({
    budget: [],
    showAddBudget: false,
  });

  const getAllBudget = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");
      const res = await fetch(`${BACKEND}/budget?username=${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        throw new Error("error fetching transaction in range");
      }

      const data = await res.json();
      console.log(data);
      setState((prev) => ({
        ...prev,
        budget: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllBudget();
    }, [])
  );

  return (
    <View className="mt-4">
      <View className="flex flex-row justify-between w-full bg-[#d4eff1] py-4 rounded-lg px-4">
        <View className="flex flex-row gap-3 items-center">
          <Icon name="list-alt" size={20} color="#000" />
          <Text className="text-lg font-bold">Budget</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            setState((prev) => ({
              ...prev,
              showAddBudget: true,
            }))
          }
        >
          <View>
            <Icon name="plus" size={20} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={state.budget || []}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => <BudgetBlock budget={item} />}
        />
      </View>
      {state.showAddBudget && (
        <Modal transparent={true} animationType="slide">
          <AddBudget stateVisibility={state} setStateVisibility={setState} />
        </Modal>
      )}
    </View>
  );
};

export default TransactionBudget;
