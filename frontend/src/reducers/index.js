import { combineReducers } from "redux";
import authReducer from '../slices/AuthSlice'
import loadingBarReducer from "../slices/LoadingBarSlice"
import ThemeSlice from "../slices/ThemeSlice";
import profileSlice from '../slices/ProfileSlice'
import problemSlice from '../slices/ProblemSlice'

const rootReducer=combineReducers({
    auth:authReducer,
    theme:ThemeSlice,
    loadingBar: loadingBarReducer,
    profile:profileSlice,
    problem:problemSlice
   
    
})

export default rootReducer;