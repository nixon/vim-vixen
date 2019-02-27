import messages from 'shared/messages';

export default class BackgroundPresenter {
  getLastFindKeyword() {
    return browser.runtime.sendMessage({
      type: messages.FIND_GET_KEYWORD,
    });
  }

  setLastFindKeyword(keyword) {
    return browser.runtime.sendMessage({
      type: messages.FIND_SET_KEYWORD,
      keyword,
    });
  }
}
