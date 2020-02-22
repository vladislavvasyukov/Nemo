import { combineReducers } from 'redux';
import nemo from "./nemo";
import auth from "./auth";


const annotationApp = combineReducers({
    nemo, auth,
})

export default nemoApp;
