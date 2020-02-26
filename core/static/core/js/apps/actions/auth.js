import C from '../constants';


export const loadUser = () => {
    return (dispatch, getState) => {
        dispatch({type: C.USER_LOADING});

        const token = getState().auth.token;

        let headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("/api/auth/user/", {headers, })
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                }
            })
            .then(res => {
                if (res.status === 200) {
                    dispatch({type: C.USER_LOADED, user: res.data });
                    return res.data;
                }
            })
    }
}

export const login = (email, password) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let body = JSON.stringify({email, password});

        return fetch("/api/auth/login/", {headers, body, method: "POST"})
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 200) {
                    dispatch({type: C.LOGIN_SUCCESSFUL, data: res.data });
                    return res.data;
                } else if (res.status === 403 || res.status === 401) {
                    dispatch({type: C.AUTHENTICATION_ERROR, data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: C.LOGIN_FAILED, data: res.data});
                    throw res.data;
                }
            })
    }
}

export const register = (username, email, password) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let body = JSON.stringify({username, email, password});

        return fetch("/api/auth/register/", {headers, body, method: "POST"})
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 200) {
                    dispatch({type: C.REGISTRATION_SUCCESSFUL, data: res.data });
                    return res.data;
                } else if (res.status === 403 || res.status === 401) {
                    dispatch({type: C.AUTHENTICATION_ERROR, data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: C.REGISTRATION_FAILED, data: res.data});
                    throw res.data;
                }
            })
    }
}

export const logout = () => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};

        return fetch("/api/auth/logout/", {headers, body: "", method: "POST"})
            .then(res => {
                if (res.status === 204) {
                    return {status: res.status, data: {}};
                } else if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 204) {
                    dispatch({type: C.LOGOUT_SUCCESSFUL});
                    return res.data;
                } else if (res.status === 403 || res.status === 401) {
                    dispatch({type: C.AUTHENTICATION_ERROR, data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: C.LOGOUT_FAILED, data: res.data});
                    throw res.data;
                }
            })
    }
}
