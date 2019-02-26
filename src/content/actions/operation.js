import operations from 'shared/operations';
import messages from 'shared/messages';
import * as urls from '../../shared/urls';
import * as addonActions from './addon';
import * as markActions from './mark';
import * as properties from 'shared/settings/properties';
import ScrollPresenter from '../presenters/ScrollPresenter';
import ClipboardPresenter from '../presenters/ClipboardPresenter';
import NavigationPresenter from '../presenters/NavigationPresenter';
import PagePresenter from '../presenters/PagePresenter';
import ConsolePresenter from '../presenters/ConsolePresenter';

let scrolls = new ScrollPresenter();
let clipboardPresenter = new ClipboardPresenter();
let navigates = new NavigationPresenter();
let pagePresenter = new PagePresenter();
let consolePresenter = new ConsolePresenter();

// eslint-disable-next-line complexity, max-lines-per-function
const exec = (operation, settings, addonEnabled) => {
  let smoothscroll = settings.properties.smoothscroll ||
    properties.defaults.smoothscroll;
  switch (operation.type) {
  case operations.ADDON_ENABLE:
    return addonActions.enable();
  case operations.ADDON_DISABLE:
    return addonActions.disable();
  case operations.ADDON_TOGGLE_ENABLED:
    return addonActions.setEnabled(!addonEnabled);
  case operations.FIND_NEXT:
    window.top.postMessage(JSON.stringify({
      type: messages.FIND_NEXT,
    }), '*');
    break;
  case operations.FIND_PREV:
    window.top.postMessage(JSON.stringify({
      type: messages.FIND_PREV,
    }), '*');
    break;
  case operations.SCROLL_VERTICALLY:
    scrolls.scrollVertically(operation.count, smoothscroll);
    break;
  case operations.SCROLL_HORIZONALLY:
    scrolls.scrollHorizonally(operation.count, smoothscroll);
    break;
  case operations.SCROLL_PAGES:
    scrolls.scrollPages(operation.count, smoothscroll);
    break;
  case operations.SCROLL_TOP:
    scrolls.scrollToTop(smoothscroll);
    break;
  case operations.SCROLL_BOTTOM:
    scrolls.scrollToBottom(smoothscroll);
    break;
  case operations.SCROLL_HOME:
    scrolls.scrollToHome(smoothscroll);
    break;
  case operations.SCROLL_END:
    scrolls.scrollToEnd(smoothscroll);
    break;
  case operations.FOLLOW_START:
    window.top.postMessage(JSON.stringify({
      type: messages.FOLLOW_START,
      newTab: operation.newTab,
      background: operation.background,
    }), '*');
    break;
  case operations.MARK_SET_PREFIX:
    return markActions.startSet();
  case operations.MARK_JUMP_PREFIX:
    return markActions.startJump();
  case operations.NAVIGATE_HISTORY_PREV:
    navigates.goHistoryPrev(window);
    break;
  case operations.NAVIGATE_HISTORY_NEXT:
    navigates.goHistoryNext(window);
    break;
  case operations.NAVIGATE_LINK_PREV:
    navigates.goLinkPrev(window);
    break;
  case operations.NAVIGATE_LINK_NEXT:
    navigates.goLinkNext(window);
    break;
  case operations.NAVIGATE_PARENT:
    navigates.goParent(window);
    break;
  case operations.NAVIGATE_ROOT:
    navigates.goRoot(window);
    break;
  case operations.FOCUS_INPUT:
    pagePresenter.focusInput();
    break;
  case operations.URLS_YANK:
    clipboardPresenter.write(window.location.href);
    consolePresenter.showInfo('Current url yanked');
    break;
  case operations.URLS_PASTE: {
    let value = clipboardPresenter.read();
    let url = urls.searchUrl(value, settings.search);
    browser.runtime.sendMessage({
      type: messages.OPEN_URL,
      url,
      newTab: Boolean(operation.newTab),
    });
  }
    break;
  default:
    browser.runtime.sendMessage({
      type: messages.BACKGROUND_OPERATION,
      operation,
    });
  }
  return { type: '' };
};

export { exec };
