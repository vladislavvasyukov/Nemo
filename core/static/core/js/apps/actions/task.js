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
                if (res.status === 200) {
                    dispatch({type: C.ADD_TASK_SUCCESSFUL, data: res.data });
                    return res.data;
                } else if (res.status === 403 || res.status === 401) {
                    dispatch({type: C.ADD_TASK_FAILED, data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: C.ADD_TASK_FAILED, data: res.data});
                    throw res.data;
                }
            })
    }
}

export const getTasksToExecute = () => {
    return (dispatch, getState) => {
        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        return fetch(`/api/tasks/`, {headers})
            .then((res) => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    });
                } else {
                    console.log(res)
                }
            })
            .then(res => {
                if (res.status == 200) {
                    let data = {
                        tasks_to_execute: res.data
                    }
                    dispatch({type: C.GET_TASKS_TO_EXECUTE_SUCCESSFUL, data});
                    return res.data;
                } else if (res.status == 403 || res.status == 401) {
                    dispatch({type: C.GET_TASKS_TO_EXECUTE_FAILED, data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: C.GET_TASKS_TO_EXECUTE_FAILED, data: res.data});
                    throw res.data;
                }
            });
    }
}
