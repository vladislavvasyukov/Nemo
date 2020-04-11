import C from '../constants';


const initialState = {
    showModalAddTask: false,
    isLoading: false,
    task: {},

    tasks_to_execute: [],
    current_page_to_execute: 1,
    num_pages_to_execute: 0,

    manager_tasks: [],
    company_users: [],
    current_page_manager: 1,
    num_pages_manager: 0,

    descriptionMode: false,
    taskEditMode: false,
};


export default function nemo(state=initialState, action) {
    switch (action.type) {
        case C.ADD_TASK_SHOW_TOGGLE:
            return {
                ...state,
                showModalAddTask: !state.showModalAddTask,
            };

        case C.ADD_TASK_SUCCESSFUL:
            console.log(action.data.task)
            return {
                ...state,
                task: {
                    ...action.data.task,
                },
                showModalAddTask: false,
                taskEditMode: false,
                descriptionMode: false,
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
                task: {
                    ...action.data,
                }
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

        case C.DESCRIPTION_EDIT_MODE_TOGGLE:
            return {
                ...state,
                descriptionMode: !state.descriptionMode,
            }

        case C.TASK_EDIT_MODE_TOGGLE:
            return {
                ...state,
                taskEditMode: !state.taskEditMode,
            }

        case C.SAVE_DESCRIPTION_SUCCESSFUL:
            return {
                ...state,
                descriptionMode: false,
                task: action.data,
            }

        case C.ADD_WORK_HOURS_SUCCESSFUL:
            return {
                ...state,
                task: {
                    ...action.data.task,
                }
            }

        default:
            return state;
    }
}
