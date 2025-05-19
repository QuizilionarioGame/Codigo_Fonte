import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
          },
        }),
        tabBarItemStyle: {
          marginTop: 8, // Adiciona espaço entre os ícones e o topo da tabBar
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Login',
          tabBarIcon: ({ focused, size, color }) => {
            if (focused) { 
              return <IconSymbol size={size} name="person.fill" color={color} />;
            }
            return <IconSymbol size={size} name="person" color={color} />;
             },
        }}
      />
      <Tabs.Screen
        name="ranks"
        options={{
          title: 'Ranks',
          tabBarIcon: ({ focused, size, color }) => {
            if (focused) { 
              return <IconSymbol size={size} name="trophy.fill" color={color} />;
            }
            return <IconSymbol size={size} name="trophy" color={color} />;
             },
        }}
      />
      <Tabs.Screen
        name="fase"
        options={{
          title: 'Fases',
          tabBarIcon: ({ focused, size, color }) => {
            if (focused) { 
              return <IconSymbol size={size} name="exclamationmark" color={color} />;
            }
            return <IconSymbol size={size} name="exclamationmark" color={color} />;
             },
        }}
      />
    </Tabs>
  );
}
