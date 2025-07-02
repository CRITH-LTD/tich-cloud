import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import umsCreationReducer from "../features/UMS/UMSCreationSlice";
import umsManagementReducer from "../features/UMS/UMSManagementSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        umsCreation: umsCreationReducer,
        umsManagement: umsManagementReducer,
    },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
