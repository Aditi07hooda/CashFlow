import React from "react";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { router } from "expo-router";
import icons from "../assets/icons"; 

const DoubleUpButton = () => {
  const translateY = useSharedValue(0);

  // Define the continuous up-and-down animation
  translateY.value = withRepeat(
    withTiming(-10, { duration: 500, easing: Easing.inOut(Easing.ease) }),
    -1, // Infinite repeats
    true // Reverse direction
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handlePress = () => {
    router.replace("/(auth)/Signin");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {/* Static Circle Button */}
        <View style={styles.iconContainer}>
          {/* Animated Image */}
          <Animated.Image
            source={icons.DownwardArrow}
            resizeMode="contain"
            style={[styles.icon, animatedStyle]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DoubleUpButton;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  iconContainer: {
    backgroundColor: "#f87171",
    padding: 12,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: 60,
    height: 60,
    justifyContent: "center", 
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
  },
});