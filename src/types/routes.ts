// types/routes.ts

export type RouteDefinition = {
    HOME: string;
    AUTH: {
        LOGIN: string;
        SIGNUP: string;
        FORGOT_PASSWORD: string;
        RESET_PASSWORD: string;
        VERIFY_OTP: string;
    };
    DASHBOARD: string;
    PROFILE: (userId: string | number) => string;
    MESSAGES: (userId: string | number) => string;
    PROPERTIES: string;
    TRANSACTIONS: string;
    ADMIN: {
        DASHBOARD: string;
        USERS: string;
        SETTINGS: string;
    };
};

export const ROUTES: RouteDefinition = {
    HOME: '/',
    AUTH: {
        LOGIN: '/login',
        SIGNUP: '/signup',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        VERIFY_OTP: '/verify-otp',
    },
    DASHBOARD: '/dashboard',
    PROFILE: (userId) => `/profile/${userId}`,
    MESSAGES: (chatId) => `/messages/${chatId}`,
    PROPERTIES: '/properties',
    TRANSACTIONS: '/transactions',
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        USERS: '/admin/users',
        SETTINGS: '/admin/settings',
    },
};
