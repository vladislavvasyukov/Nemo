import C from '../constants';


const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false || Boolean(localStorage.getItem("token")),
    isLoading: true,
    user: {},
    login_errors: {},
    register_errors: [],
    current_company_id: null,
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
                ...action.data,
                isAuthenticated: true, 
                isLoading: false,
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
                user: {},
                isAuthenticated: false, 
                isLoading: false
            };

        case C.SET_REGISTER_ERRORS:
            return {
                ...state,
                ...action.data,
            };

        case C.AVATAR_UPLOAD_SUCCESSFUL:
            return {
                ...state,
                user: {
                    ...action.data
                },
            }

        case C.AVATAR_UPLOAD_FAILED:
            return {
                ...state,
                ...action.data,
            }

        case C.SAVE_PROFILE_SUCCESSFUL:
            return {
                ...state,
                user: {
                    ...action.data,
                }
            }

        case C.LEAVE_COMPANY_SUCCESSFUL:
            return {
                ...state,
                ...action.data,
            }

        case C.SAVE_COMPANY_NAME_SUCCESSFUL:
            console.log(action.data.user)
            return {
                ...state,
                user: {
                    ...action.data.user
                }
            }

        default:
            return state;
    }
}
