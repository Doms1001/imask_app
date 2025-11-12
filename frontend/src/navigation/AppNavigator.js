// frontend/src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../screens/OnboardingScreen";
import FillupScreen from "../screens/FillupScreen";
import WelcomingDept from "../screens/welcomingdept";
import Departments from "../screens/Departments";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Fillup" component={FillupScreen} />
        <Stack.Screen name="welcomingdept" component={WelcomingDept} />
        <Stack.Screen name="Departments" component={Departments} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
