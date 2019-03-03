import { combineReducers } from 'redux';
import addon from './addon';
import input from './input';
import followController from './follow-controller';
import mark from './mark';

export default combineReducers({
  addon, input, followController, mark,
});
