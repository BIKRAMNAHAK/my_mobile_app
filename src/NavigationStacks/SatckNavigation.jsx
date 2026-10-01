import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const SatckNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#14367E' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen name="Main" getComponent={() => require('./BottomTabNavigation').default} options={{ headerShown: false }} />
            <Stack.Screen name="Docs" getComponent={() => require('../Screens/DocsScreen').default} options={{ title: 'Documentation' }} />
          
        </Stack.Navigator>
    );
};

export default SatckNavigation;


