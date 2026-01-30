import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../types";






const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    status: "UNAUTHENTICATED",
    accessToken: null
}


export const authSlice = createSlice({
    name: "useAuth",
    initialState,
    reducers: {
        isLoggedIn: (state, action) => {
            state.user = action.payload.user
            state.isAuthenticated = true
            state.status = "AUTHENTICATED"
            state.accessToken = action.payload.accessToken
        },
        },

    
})


export const { isLoggedIn } = authSlice.actions
export default authSlice.reducer
