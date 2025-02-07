import React from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const InputFormField = ({
  title,
  placeholder,
  keyboardType,
  onChange,
  secureTextEntry,
}) => {
  return (
    <SafeAreaView className="mx-3">
      <Text className="leading-snug tracking-wide text-lg font-semibold">
        {title}
      </Text>
      <View className="px-4 border-2 rounded-md mt-2">
        <TouchableOpacity>
          <TextInput
            keyboardType={keyboardType}
            placeholder={placeholder}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            dataDetectorTypes={title === "Transaction Date" ? "calendarEvent" : ""}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InputFormField;
