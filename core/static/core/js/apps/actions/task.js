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

export function addTask() {
    console.log('add task')
}
