import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import propertyReducer from './propertySlice';
import autocompleteReducer from './autocompleteSlice';
import eachpropertyReduce from './eachpropertySlice';

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
		eachproperty : eachpropertyReduce,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AsyncThunkConfig = {
    state: RootState;
    rejectValue: string;
};
