import C from '../constants';


const initialState = {

};


export default function nemo(state=initialState, action) {

    switch (action.type) {

        case C.GET_NOTES:
            return {
                ...state, 
                isLoading: true
            };

        default:
            return state;
    }
}
