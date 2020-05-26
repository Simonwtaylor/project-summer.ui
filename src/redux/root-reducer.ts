import { combineReducers } from 'redux';
import { UserReducer } from './user/user.reducer';
import SprintReducer from './sprint/sprint.reducer';

export default combineReducers({
  user: UserReducer,
  sprint: SprintReducer,
});