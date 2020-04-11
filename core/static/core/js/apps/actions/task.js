import C from '../constants';
import { showSuccessMessage, showErrorMessage, errorMessageToString } from '../utils';

export function addTaskShowToggle() {
    return (dispatch) => {
        dispatch({
            type: C.ADD_TASK_SHOW_TOGGLE
        });
    }
}

export function toggleDescriptionMode() {
    return (dispatch) => {
        dispatch({
            type: C.DESCRIPTION_EDIT_MODE_TOGGLE,
        });
    }
}

export function toggleTaskEditMode() {
    return (dispatch) => {
        dispatch({
            type: C.TASK_EDIT_MODE_TOGGLE,
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
                if (res.status === 200) {
                    dispatch({type: C.ADD_TASK_SUCCESSFUL, data: res.data });
                    showSuccessMessage('Успешно!', 'Задача создана');
                    return res.data;
                } else {
                    dispatch({type: C.ADD_TASK_FAILED, data: res.data});
                    showErrorMessage('Не удалось создать задачу', errorMessageToString(res.data));
                }
            })
    }
}

export const getTaskList = (to_execute, page=1) => {
    return (dispatch, getState) => {
        dispatch({type: C.GET_TASKS_REQUEST});
        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let param = to_execute ? '&to_execute' : '';

        return fetch(`/api/tasks/?page=${page}${param}`, {headers})
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
                    const {results, count, current_page, num_pages} = res.data;
                    let data = {};

                    if (to_execute) {
                        data.tasks_to_execute = results;
                        data.current_page_to_execute = current_page;
                        data.num_pages_to_execute = num_pages;

                        const task_id = results[0] && results[0].id;
                        dispatch(getTask(task_id));
                    } else {
                        data.manager_tasks = results;
                        data.current_page_manager = current_page;
                        data.num_pages_manager = num_pages;
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

        if (!task_id) {
            const data = {
                task: {},
            }
            dispatch({type: C.GET_TASK_DETAIL_SUCCESSFUL, data: data});
            return data;
        }

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

export const saveDescription = (description, task_id) => {
    return (dispatch, getState) => {
        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({description, task_id});

        return fetch("/api/save_description/", {headers, body, method: "POST"})
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
                    description: res.data.description,
                }
                if (res.status === 200) {
                    dispatch({type: C.SAVE_DESCRIPTION_SUCCESSFUL, data: data });
                    return res.data;
                } else {
                    dispatch({type: C.SAVE_DESCRIPTION_FAILED, data: res.data});
                    throw res.data;
                }
            })
    }
}

export const avatarUpload = (form_data) => {
    return (dispatch, getState) => {
        const token = getState().auth.token;
        let headers = {};
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        fetch('/api/avatar_upload/', {
            headers,
            method: 'POST',
            credentials: 'same-origin',
            body: form_data
        }).then(res => {
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
            const user = getState().auth.user;

            let data = {
                ...user,
                avatar_url: res.data.avatar_url,
            }

            if (res.status === 200) {
                dispatch({type: C.AVATAR_UPLOAD_SUCCESSFUL, data: data });
                return res.data;
            } else {
                dispatch({type: C.AVATAR_UPLOAD_FAILED, data: res.data});
                throw res.data;
            }
        })
    }
}

export const saveUserProfile = (data, user_id) => {
    return (dispatch, getState) => {

        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({...data});

        return fetch(`/api/save_profile/${user_id}/`, {headers, body, method: "POST"})
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
                    dispatch({type: C.SAVE_PROFILE_SUCCESSFUL, data: res.data.user });
                    return res.data;
                } else {
                    dispatch({type: C.SAVE_PROFILE_FAILED, data: res.data});
                    showErrorMessage('Не удалось сохранить данные', errorMessageToString(res.data));
                }
            })
    }
}

export const leaveCompany = (company_id) => {
    return (dispatch, getState) => {
        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({company_id});

        return fetch('/api/leave_company/', {headers, body, method: "POST"})
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
                    let data = {
                        current_company_id: res.data.current_company_id,
                        user: {
                            ...res.data.user
                        }
                    }
                    dispatch({type: C.LEAVE_COMPANY_SUCCESSFUL, data: data });
                    showSuccessMessage('Успешно!', 'Вы покинули компанию!');
                    return res.data;
                } else {
                    dispatch({type: C.LEAVE_COMPANY_FAILED, data: res.data});
                    showErrorMessage('Что-то пошло не так', errorMessageToString(res.data));
                }
            })
    }
}

export const addWorkHours = (data) => {
    return (dispatch, getState) => {
        let headers = {
            "Content-Type": "application/json",
        };
        const token = getState().auth.token;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({...data});

        return fetch('/api/add_work_hours/', {headers, body, method: "POST"})
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
                    dispatch({type: C.ADD_WORK_HOURS_SUCCESSFUL, data: res.data });
                    showSuccessMessage('Успешно!', '');
                    return res.data;
                } else {
                    dispatch({type: C.ADD_WORK_HOURS_FAILED, data: res.data});
                    showErrorMessage('Что-то пошло не так', errorMessageToString(res.data.message));
                }
            })
    }
}