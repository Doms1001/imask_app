// frontend/src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../screens/OnboardingScreen";
import FillupScreen from "../screens/FillupScreen";
import WelcomingDept from "../screens/welcomingdept";
import Departments from "../screens/Departments";

// add these two (ensure the paths match where you saved the files)
import CCSF1 from "../screens/CCS/CCSF1";
import CCSF2 from "../screens/CCS/CCSF2";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Fillup" component={FillupScreen} />
        <Stack.Screen name="welcomingdept" component={WelcomingDept} />
        <Stack.Screen name="Departments" component={Departments} />

        {/* CCS screens */}
        <Stack.Screen name="CCSF1" component={CCSF1} />
        <Stack.Screen name="CCSF2" component={CCSF2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
