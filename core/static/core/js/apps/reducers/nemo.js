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

        default:
            return state;
    }
}
