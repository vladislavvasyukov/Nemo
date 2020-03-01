import C from '../constants';


const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    isLoading: true,
    user: null,
    login_errors: {},
    register_errors: [],
};


export default function auth(state=initialState, action) {

    switch (action.type) {

        case C.USER_LOADING:
            return {
                ...state, 
                isLoading: true
            };

        case C.USER_LOADED:
            return {
                ...state, 
                isAuthenticated: true, 
                isLoading: false, 
                user: action.user
            };

        case C.LOGIN_SUCCESSFUL:
        case C.REGISTRATION_SUCCESSFUL:
            localStorage.setItem("token", action.data.token);
            return {
                ...state, 
                ...action.data, 
                isAuthenticated: true, 
                isLoading: false, 
                login_errors: null,
                register_errors: null,
            };

        case C.AUTHENTICATION_ERROR:
        case C.LOGIN_FAILED:
        case C.REGISTRATION_FAILED:
        case C.LOGOUT_SUCCESSFUL:
            localStorage.removeItem("token");
            return {
                ...state, 
                ...action.data, 
                token: null, 
                user: null,
                isAuthenticated: false, 
                isLoading: false
            };

        case C.SET_REGISTER_ERRORS:
            return {
                ...state,
                ...action.data,
            };

        default:
            return state;
    }
}
