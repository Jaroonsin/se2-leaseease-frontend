import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './slice/auth/authSlice';
import propertyReducer from './slice/propertySlice';
import autocompleteReducer from './slice/autocompleteSlice';
import eachpropertyReducer from './slice/eachpropertySlice';
import reservationsReducer from './slice/historySlice';
import chatReducer from './slice/chatSlice';
import userReducer from './slice/userSlice';

const loggerMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    console.log('Dispatching action:', action);
    const result = next(action);
    console.log('New State:', storeAPI.getState());
    return result;
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        property: propertyReducer,
        autocompleteReducer: autocompleteReducer,
        eachproperty: eachpropertyReducer,
        reservations: reservationsReducer,
        chat: chatReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['chat/addMessage', 'chat/setWebSocket'],
                ignoredPaths: ['chat.ws'],
            },
        }).concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AsyncThunkConfig = {
    state: RootState;
    rejectValue: string;
};
