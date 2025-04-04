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
    USER: {
        DASHBOARD: string;
    };
    PROFILE: (userId: string | number) => string;
    MESSAGES: (chatId: string | number) => string;
    PROPERTIES: (proertyId: string | number) => string;
    TRANSACTIONS: string;
    ADMIN: {
        USERS: string;
        SETTINGS: string;
    };
};

export const ROUTES: RouteDefinition = {
    HOME: '/',
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_OTP: '/auth/verify-otp',
    },
    USER: {
        DASHBOARD: '/users/dashboard',
    },
    PROFILE: (userId) => `/profile/${userId}`,
    MESSAGES: (chatId) => `/messages/${chatId}`,
    PROPERTIES: (proertyId) => `/properties/${proertyId}`,
    TRANSACTIONS: '/transactions',
    ADMIN: {
        USERS: '/admin/users',
        SETTINGS: '/admin/settings',
    },
};
