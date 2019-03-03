import * as markActions from 'content/actions/mark';
import ScrollPresenter from '../../presenters/ScrollPresenter';
import ConsolePresenter from '../../presenters/ConsolePresenter';
import SettingRepository from '../../repositories/SettingRepository';

let scrolls = new ScrollPresenter();
let consolePresenter = new ConsolePresenter();
let settingRepository = new SettingRepository();

const cancelKey = (key) => {
  return key.key === 'Esc' || key.key === '[' && key.ctrlKey;
};

const globalKey = (key) => {
  return (/^[A-Z0-9]$/).test(key);
};

export default class MarkComponent {
  constructor(body, store) {
    this.body = body;
    this.store = store;
  }

  // eslint-disable-next-line max-statements
  key(key) {
    let { mark: markStage } = this.store.getState();
    let settings = settingRepository.get();
    let smoothscroll = settings.properties.smoothscroll;

    if (!markStage.setMode && !markStage.jumpMode) {
      return false;
    }

    if (cancelKey(key)) {
      this.store.dispatch(markActions.cancel());
      return true;
    }

    if (key.ctrlKey || key.metaKey || key.altKey) {
      consolePresenter.showError('Unknown mark');
    } else if (globalKey(key.key) && markStage.setMode) {
      this.doSetGlobal(key);
    } else if (globalKey(key.key) && markStage.jumpMode) {
      this.doJumpGlobal(key);
    } else if (markStage.setMode) {
      this.doSet(key);
    } else if (markStage.jumpMode) {
      this.doJump(markStage.marks, key, smoothscroll);
    }

    this.store.dispatch(markActions.cancel());
    return true;
  }

  doSet(key) {
    let { x, y } = scrolls.getScroll();
    this.store.dispatch(markActions.setLocal(key.key, x, y));
  }

  doJump(marks, key, smoothscroll) {
    if (!marks[key.key]) {
      consolePresenter.showError('Mark is not set');
      return;
    }

    let { x, y } = marks[key.key];
    scrolls.scrollTo(x, y, smoothscroll);
  }

  doSetGlobal(key) {
    let { x, y } = scrolls.getScroll();
    this.store.dispatch(markActions.setGlobal(key.key, x, y));
  }

  doJumpGlobal(key) {
    this.store.dispatch(markActions.jumpGlobal(key.key));
  }
}
