import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import React, { useCallback, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotesBlock from "./NotesBlock";
import { useFocusEffect } from "expo-router";
import Constants from "expo-constants";
import AddNote from "./AddNote";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const TransactionsNote = () => {
  const [state, setState] = useState({
    showAddNote: false,
    notes: [],
  });

  const getAllNotes = async () => {
    try {
      const jwtFetch = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwtFetch).jwtToken;
      const username = await AsyncStorage.getItem("username");
      const res = await fetch(`${BACKEND}/notes?username=${username}`, {
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
        notes: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllNotes();
    }, [])
  );

  return (
    <View className="mt-4">
      <View className="flex flex-row justify-between w-full bg-[#d4eff1] py-4 rounded-lg px-4">
        <Text className="font-semibold text-lg">Notes</Text>
        <TouchableOpacity
          onPress={() =>
            setState((prev) => ({
              ...prev,
              showAddNote: true,
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
          data={state.notes || []}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => <NotesBlock note={item} />}
        />
      </View>

      {state.showAddNote && (
        <Modal transparent={true} animationType="slide">
          <AddNote stateVisibility={state} setStateVisibility={setState}/>
        </Modal>
      )}
    </View>
  );
};

export default TransactionsNote;
