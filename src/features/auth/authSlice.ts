import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserInterface from "../../interfaces/user.interface";

export interface AuthState {
    accessToken: string | null;
    user: UserInterface | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    accessToken: localStorage.getItem("access_token"),
    user: null,
    isAuthenticated: !!localStorage.getItem("access_token"),
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ accessToken: string }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.user = null; // User can be loaded later with a /me endpoint
            state.isAuthenticated = true;
            localStorage.setItem("access_token", action.payload.accessToken);
        },

        setUser: (
            state,
            action: PayloadAction<UserInterface>
        ) => {
            state.user = action.payload;
        }
        ,
        logout: (state) => {
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("access_token");
        },
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
