import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../Screens/HomeScreen';

const Tab = createBottomTabNavigator();

// Colors ek jagah, baad me theme se jod sakte ho
const COLORS = {
    primary: '#14367E',
    pill: '#E8EEFC',
    inactive: '#8e8e93',
    bar: '#ffffff',
};

// Route name -> icon (screens banne par yahan naam add karna)
const ICONS = {
    Home: ['home', 'home-outline'],
    // Amc: ['construct', 'construct-outline'],
    // Settings: ['settings', 'settings-outline'],
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.bar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state.index === index;

                const [activeIcon, inactiveIcon] = ICONS[route.name] || ['ellipse', 'ellipse-outline'];

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({ type: 'tabLongPress', target: route.key });
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        activeOpacity={0.8}
                        style={styles.tab}
                    >
                        <View style={[styles.pill, isFocused && styles.pillActive]}>
                            <Ionicons name={isFocused ? activeIcon : inactiveIcon} size={22} color={isFocused ? COLORS.primary : COLORS.inactive} />
                            {isFocused && (
                                <Text style={styles.label} numberOfLines={1}>
                                    {label}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            {/* Tab.Screen yahan add honge */}
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        backgroundColor: COLORS.bar,
        paddingTop: 10,
        paddingHorizontal: 8,
        // borderTopLeftRadius: 24,
        // borderTopRightRadius: 24,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    pillActive: {
        backgroundColor: COLORS.pill,
    },
    label: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
    },
});