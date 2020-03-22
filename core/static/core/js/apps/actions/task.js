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
                        const task_id = res.data[0] && res.data[0].id;
                        dispatch(getTask(task_id));
                    } else {
                        data.manager_tasks = res.data;
                    }
                    dispatch({type: C.GET_TASKS_SUCCESSFUL, data});
                    return res.data;
                } else {
                    dispatch({type: C.GET_TASKS_FAILED, data: res.data});
                    throw res.data;
                }
            });
    }
}

export const getTask = (task_id) => {
    return (dispatch, getState) => {

        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        return fetch(`/api/get_task/${task_id}/`, {headers})
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
                    dispatch({type: C.GET_TASK_DETAIL_SUCCESSFUL, data: res.data});
                    return res.data;
                } else {
                    dispatch({type: C.GET_TASK_DETAIL_FAILED, data: res.data});
                    throw res.data;
                }
            });
    }
}

export const createComment = (text, task) => {
    return (dispatch, getState) => {
        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({text, task});

        return fetch("/api/create_comment/", {headers, body, method: "POST"})
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
                const task = getState().nemo.task;

                let data = {
                    ...task,
                    comments: [...task.comments, res.data.comment]
                }

                if (res.status === 200) {
                    dispatch({type: C.CREATE_COMMENT_SUCCESSFUL, data: data });
                    return res.data;
                } else {
                    dispatch({type: C.CREATE_COMMENT_FAILED, data: res.data});
                    throw res.data;
                }
            })
    }
}
