// frontend/src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../screens/OnboardingScreen";
import FillupScreen from "../screens/FillupScreen";
import WelcomingDept from "../screens/welcomingdept";
import Departments from "../screens/Departments";

import CCSF1 from "../screens/CCS/CCSF1";
import CCSF2 from "../screens/CCS/CCSF2";
import CCSF3 from "../screens/CCS/CCSF3";
import CCSF4 from "../screens/CCS/CCSF4";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right", // ⭐ Perfect for your requirement
          animationDuration: 350, // adjust speed if you want slower or faster
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Fillup" component={FillupScreen} />
        <Stack.Screen name="welcomingdept" component={WelcomingDept} />
        <Stack.Screen name="Departments" component={Departments} />

        {/* CCS screens */}
        <Stack.Screen name="CCSF1" component={CCSF1} />
        <Stack.Screen name="CCSF2" component={CCSF2} />
        <Stack.Screen name="CCSF3" component={CCSF3} />
        <Stack.Screen name="CCSF4" component={CCSF4} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
