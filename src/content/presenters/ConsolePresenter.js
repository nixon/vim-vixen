import messages from '../../shared/messages';

const IFRAME_ID = 'vimvixen-console-frame';

export default class ConsolePresenter {
  create(doc) {
    let iframe = doc.createElement('iframe');
    iframe.src = browser.runtime.getURL('build/console.html');
    iframe.id = IFRAME_ID;
    iframe.className = 'vimvixen-console-frame';
    doc.body.append(iframe);
  }

  blur(doc) {
    let iframe = doc.getElementById(IFRAME_ID);
    iframe.blur();
  }

  showError(text) {
    browser.runtime.sendMessage({
      type: messages.CONSOLE_FRAME_MESSAGE,
      message: {
        type: messages.CONSOLE_SHOW_ERROR,
        text,
      },
    });
  }

  showInfo(text) {
    browser.runtime.sendMessage({
      type: messages.CONSOLE_FRAME_MESSAGE,
      message: {
        type: messages.CONSOLE_SHOW_INFO,
        text,
      },
    });
  }
}
