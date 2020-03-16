import C from '../constants';

export function addTaskShowModal() {
    return (dispatch) => {
        dispatch({
            type: C.ADD_TASK_SHOW_MODAL
        });
    }
}

export function addTaskHideModal() {
    return (dispatch) => {
        dispatch({
            type: C.ADD_TASK_HIDE_MODAL
        });
    }
}

export const addTask = (data) => {
    return (dispatch, getState) => {

        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({...data});

        return fetch("/api/create_task/", {headers, body, method: "POST"})
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
                console.log(res)
//                if (res.status === 200) {
//                    dispatch({type: C.REGISTRATION_SUCCESSFUL, data: res.data });
//                    return res.data;
//                } else if (res.status === 403 || res.status === 401) {
//                    dispatch({type: C.AUTHENTICATION_ERROR, data: { register_errors: res.data }});
//                    throw res.data;
//                } else {
//                    let register_errors = [];
//                    for (let key in res.data) {
//                        register_errors.push({
//                            field: key,
//                            message: res.data[key][0],
//                        });
//                    }
//                    dispatch({type: C.REGISTRATION_FAILED, data: { register_errors: register_errors }});
//                    throw res.data;
//                }
            })
    }
}