import C from '../constants';


const initialState = {
    showModalAddTask: false,
    isLoading: false,
    task: {},

    tasks_to_execute: [],
    current_page_to_execute: 1,
    num_pages_to_execute: 0,

    manager_tasks: [],
    current_page_manager: 1,
    num_pages_manager: 0,
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

        case C.GET_TASKS_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case C.GET_TASKS_SUCCESSFUL:
            return {
                ...state,
                ...action.data,
                isLoading: false,
            }

        case C.GET_TASKS_FAILED:
            return {
                ...state,
                ...action.data,
                isLoading: false,
            }

        case C.GET_TASK_DETAIL_SUCCESSFUL:
            return {
                ...state,
                task: action.data,
            }

        case C.CREATE_COMMENT_SUCCESSFUL:
            return {
                ...state,
                task: action.data,
            }

        case C.CREATE_COMMENT_FAILED:
            return {
                ...state,
                ...action.data,
            }

        default:
            return state;
    }
}
