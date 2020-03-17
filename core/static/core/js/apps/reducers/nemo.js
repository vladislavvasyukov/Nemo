import C from '../constants';


const initialState = {
    showModalAddTask: false,
};


export default function nemo(state=initialState, action) {
    switch (action.type) {
        case C.ADD_TASK_SHOW_MODAL:
            return {
                ...state,
                showModalAddTask: true,
            };

        case C.ADD_TASK_HIDE_MODAL:
            return {
                ...state,
                showModalAddTask: false,
            };

        case C.ADD_TASK_SUCCESSFUL:
            return {
                ...state,
                ...action.data,
            }

        case C.ADD_TASK_FAILED:
            return {
                ...state,
                ...action.data,
            }

        default:
            return state;
    }
}
