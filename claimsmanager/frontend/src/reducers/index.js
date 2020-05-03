import { combineReducers } from 'redux';
import ClaimReducer from './ClaimReducer';
import ErrorsReducer from "./ErrorsReducer";
import TweetsReducer from "./TweetsReducer";
import AuthReducer from "./AuthReducer";

export default combineReducers({
  ClaimReducer,
  ErrorsReducer,
  TweetsReducer,
  AuthReducer
});