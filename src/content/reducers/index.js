import { combineReducers } from 'redux';
import addon from './addon';
import setting from './setting';
import input from './input';
import followController from './follow-controller';
import mark from './mark';

export default combineReducers({
  addon, setting, input, followController, mark,
});
