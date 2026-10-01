import axios from 'axios';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

/* =====================================================
   1. AXIOS SETUP
   ===================================================== */

// ⚠️ Apna base URL daalo
export const BASE_URL = 'https://yourdomain.com/api.php';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
});

// GET request: getApi('', { action: 'amclist', empid: 114 })
export const getApi = async (url = '', params = {}) => {
    const res = await api.get(url, { params });
    return res.data;
};

// POST request: JSON object ya FormData, dono chalte hain
export const postApi = async (url = '', data = {}) => {
    const res = await api.post(url, data);
    return res.data;
};

/* =====================================================
   2. COLOR PALETTE
   ===================================================== */

export const textColor = {
    primary: '#0B1F4B',
    secondary: '#555555',
    light: '#FFFFFF',
    muted: '#8E8E93',
    link: '#027DC1',
    success: '#2E7D32',
    error: '#E53935',
    warning: '#F9A825',
};

export const bgColor = {
    primary: '#14367E',
    secondary: '#E8EEFC',
    body: '#F5F7FA',
    card: '#FFFFFF',
    dark: '#0B1F4B',
    success: '#4CAF50',
    error: '#E53935',
    warning: '#FFF3CD',
};

/* =====================================================
   3. FONT SIZE
   ===================================================== */

export const fontSize = {
    xs: 10,
    small: 12,
    medium: 14,
    large: 18,
    xl: 24,
    custom: (size) => size,   // fontSize.custom(20)
};

/* =====================================================
   4. FONT STYLE (normal / italic)
   ===================================================== */

export const fontStyle = {
    normal: { fontStyle: 'normal' },
    italic: { fontStyle: 'italic' },
};

/* =====================================================
   5. FONT VARIANT (weight)
   ===================================================== */

export const fontVariant = {
    normal: { fontWeight: '400' },
    bold: { fontWeight: '700' },
    exbold: { fontWeight: '800' },
};

/* =====================================================
   6. PERMISSION CHECK
   ===================================================== */

const P = PermissionsAndroid.PERMISSIONS;

// Naam -> Android permission
const ANDROID_PERMISSIONS = {
    camera: P.CAMERA,
    location: P.ACCESS_FINE_LOCATION,
    notification: P.POST_NOTIFICATIONS,   // Android 13+ (API 33)
    storage: Platform.Version >= 33 ? P.READ_MEDIA_IMAGES : P.READ_EXTERNAL_STORAGE,
    microphone: P.RECORD_AUDIO,
    contacts: P.READ_CONTACTS,
};

const openSettingsAlert = (name) => {
    Alert.alert(
        'Permission required',
        `Please enable ${name} permission from the app settings.`,
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
    );
};

/**
 * Ek permission check karo, na ho to maango.
 * return: true (mil gayi) / false (nahi mili)
 *
 * await checkPermission('camera');
 */
export const checkPermission = async (name) => {
    // Android 13 se pehle notification ki runtime permission nahi hoti
    if (name === 'notification' && Platform.OS === 'android' && Platform.Version < 33) {
        return true;
    }

    // iOS: PermissionsAndroid kaam nahi karta
    if (Platform.OS !== 'android') {
        return true;
    }

    const permission = ANDROID_PERMISSIONS[name];
    if (!permission) {
        console.warn(`Unknown permission: ${name}`);
        return false;
    }

    try {
        const already = await PermissionsAndroid.check(permission);
        if (already) return true;

        const result = await PermissionsAndroid.request(permission);

        if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

        // "Don't ask again" dabaya ho to settings par bhejo
        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            openSettingsAlert(name);
        }
        return false;
    } catch (error) {
        console.log('Permission error:', error);
        return false;
    }
};

/**
 * Ek saath kai permissions
 * await checkMultiplePermissions(['camera', 'location'])
 * return: { camera: true, location: false }
 */
export const checkMultiplePermissions = async (names = []) => {
    const result = {};
    for (const name of names) {
        result[name] = await checkPermission(name);
    }
    return result;
};