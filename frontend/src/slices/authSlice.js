import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        isAuthenticated: false
    },
    reducers: {
        loginRequest(state, action){
            return{
                ...state,
                loading: true,
            }
        },
        loginSuccess(state, action){
            return{
                loading: false,
                isAuthenticated: true,
                user: action.payload.data
            }
        },
        loginFail(state, action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearError(state, action){
            return{
                ...state,
                error: null
            }
        },
        registerRequest(state, action){
            return{
                ...state,
                loading: true
            }
        },
        registerSuccess(state, action){
            return{
                loading: false,
                isAuthenticated: true,
                user: action.payload.data
            }
        },
        registerFail(state, action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        },
        loadUserRequest(state, action){
            return{
                ...state,
                isAuthenticated: false,
                loading: true
            }
        },
        loadUserSuccess(state, action){
            return{
                loading: false,
                isAuthenticated: true,
                user: action.payload.data
            }
        },
        loadUserFail(state, action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        },
        logoutSuccess(state, action){
            return{
                loading: false,
                isAuthenticated: false,
            }
        },
        logoutFail(state, action){
            return{
                ...state,
                error: action.payload
            }
        },
        updateProfileRequest(state, action){
            return{
                ...state,
                isUpdated: false,
                loading: true
            }
        },
        updateProfileSuccess(state, action){
            return{
                ...state,
                loading: false,
                isUpdated: true,
                user: action.payload.data
            }
        },
        updateProfileFail(state, action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        },
        updatePasswordRequest(state, action){
            return{
                ...state,
                isUpdated: false,
                loading: true
            }
        },
        updatePasswordSuccess(state, action){
            return{
                ...state,
                isUpdated: true,
                loading: false
            }
        },
        updatePasswordFail(state, action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        }, 
        forgotPasswordRequest(state, action){
            return{
                ...state,
                loading: true,
                message: null
            }
        },
        forgotPasswordSuccess(state, action){
            return{
                ...state,
                loading: false,
                message: action.payload.message
            }
        },
        forgotPasswordFail(state, action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        }, 
        resetPasswordRequest(state, action){
            return{
                ...state,
                loading: true
            }
        },
        resetPasswordSuccess(state, action){
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.data
            }
        },
        resetPasswordFail(state, action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        }
    }
})

const {actions, reducer} = authSlice
export const {  loginRequest, loginSuccess, loginFail, clearError,
                registerRequest, registerSuccess, registerFail,
                loadUserRequest, loadUserSuccess, loadUserFail,
                logoutSuccess, logoutFail,
                updateProfileRequest, updateProfileSuccess, updateProfileFail,
                updatePasswordRequest, updatePasswordSuccess, updatePasswordFail,
                forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFail,
                resetPasswordRequest, resetPasswordSuccess, resetPasswordFail
} = actions

export default reducer;