import { clearError, loginFail, loginRequest, loginSuccess,
         loadUserFail, loadUserRequest, loadUserSuccess,
         logoutFail, logoutSuccess,
         registerFail, registerRequest, registerSuccess, 
         updateProfileRequest,
         updateProfileSuccess,
         updateProfileFail,
         updatePasswordRequest,
         updatePasswordSuccess,
         updatePasswordFail,
         forgotPasswordRequest,
         forgotPasswordSuccess,
         resetPasswordRequest,
         resetPasswordSuccess,
         resetPasswordFail} from "../slices/authSlice"
import axios from "axios";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest())
        const { data } = await axios.post(`/login`, {email,password})
        dispatch(loginSuccess(data))

    } catch (error) {
        dispatch(loginFail(error.response.data.message))
    }
}

export const clearAuthError = (dispatch) => {
    dispatch(clearError())
}

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest())
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post(`/register`, userData, config)
        dispatch(registerSuccess(data))

    } catch (error) {
        dispatch(registerFail(error.response.data.message))
    }
}

export const loadUser = async (dispatch) => {
    try {
        dispatch(loadUserRequest())
       
        const { data } = await axios.get(`/myprofile`)
        dispatch(loadUserSuccess(data))

    } catch (error) {
        dispatch(loadUserFail(error.response.data.message))
    }
}

export const logout = async (dispatch) => {
    try {       
        await axios.get(`/logout`)
        dispatch(logoutSuccess())

    } catch (error) {
        dispatch(logoutFail)
    }
}

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest())
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/update`, userData, config)
        dispatch(updateProfileSuccess(data))

    } catch (error) {
        dispatch(updateProfileFail(error.response.data.message))
    }
}

export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest())
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        
        await axios.put(`/password/change`, formData, config)
        dispatch(updatePasswordSuccess())

    } catch (error) {
        dispatch(updatePasswordFail(error.response.data.message))
    }
}

export const forgotPassword = (formData) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest())
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        
        const {data} = await axios.post(`/password/forgot`, formData, config)
        dispatch(forgotPasswordSuccess(data))

    } catch (error) {
        dispatch(updatePasswordFail(error.response.data.message))
    }
}

export const resetPassword = (formData, token) => async (dispatch) => {
    try {
        dispatch(resetPasswordRequest())
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        
        const { data } = await axios.post(`/password/reset/${token}`, formData, config)
        dispatch(resetPasswordSuccess(data))

    } catch (error) {
        dispatch(resetPasswordFail(error.response.data.message))
    }
}