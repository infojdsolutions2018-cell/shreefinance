import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { BrandColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const getIconColor = (color: unknown): string =>
  typeof color === 'string' ? color : BrandColors.primary;

export default function TabLayout() {
  useEffect(() => {
    // Hide splash screen smoothly on load
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: BrandColors.primary,
          tabBarInactiveTintColor: '#64748b',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#e2e8f0',
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
        }}
      >
        {/* 4 Main Bottom Navigation Tabs */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={getIconColor(color)}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="application"
          options={{
            title: 'Application',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'document-text' : 'document-text-outline'}
                size={22}
                color={getIconColor(color)}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="services"
          options={{
            title: 'Services',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={22}
                color={getIconColor(color)}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={getIconColor(color)}
              />
            ),
          }}
        />

        {/* Auxiliary Routes hidden from Tab Bar */}
        <Tabs.Screen
          name="calculator"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="compare"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="track"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="partner"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="loans/index"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="loans/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
