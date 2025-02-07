import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AddNote from "./AddNote";

const NotesBlock = ({ note }) => {
  const [state, setState] = useState({
    note: note,
    showAddNote: false,
  });

  return (
    <View className="bg-white p-4 mt-2 rounded-lg shadow-md">
      {/* Dates */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-gray-500">{note.createdAt}</Text>
        <TouchableOpacity
          onPress={() => setState((prev) => ({ ...prev, showAddNote: true }))}
        >
          <Icon name="edit" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Note */}
      {note.note && (
        <Text className="text-gray-600 mt-2 capitalize">{note.note}</Text>
      )}

      {state.showAddNote && (
        <Modal transparent={true} animationType="slide">
          <AddNote stateVisibility={state} setStateVisibility={setState} />
        </Modal>
      )}
    </View>
  );
};

export default NotesBlock;
