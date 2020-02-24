import { combineReducers } from 'redux';
import nemo from "./nemo";
import auth from "./auth";


const nemoApp = combineReducers({
    nemo, auth,
})

export default nemoApp;
