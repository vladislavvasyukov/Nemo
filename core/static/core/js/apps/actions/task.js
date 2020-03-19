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

export const getTaskList = (to_execute) => {
    return (dispatch, getState) => {
        dispatch({type: C.GET_TASKS_REQUEST});
        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let param = to_execute ? '?to_execute' : '';

        return fetch(`/api/tasks/${param}`, {headers})
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
                    let data = {};
                    if (to_execute) {
                        data.tasks_to_execute = res.data;
                    } else {
                        data.manager_tasks = res.data;
                    }
                    dispatch({type: C.GET_TASKS_SUCCESSFUL, data});
                    return res.data;
                } else if (res.status == 403 || res.status == 401) {
                    dispatch({type: C.GET_TASKS_FAILED, data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: C.GET_TASKS_FAILED, data: res.data});
                    throw res.data;
                }
            });
    }
}
