import { combineReducers } from 'redux';
import notificationPopup from 'lib/reducers/notificationPopup';
import flagsReducer from './flags';
import formReducer from './form';
import languagesReducer from './languages';
import skillsReducer from './skills';

export default combineReducers({
  flags: flagsReducer,
  form: formReducer,
  languages: languagesReducer,
  skills: skillsReducer,
  notificationPopup,
});
