import messages from 'shared/messages';

export default class SettingClient {
  getSetting() {
    return browser.runtime.sendMessage({
      type: messages.SETTINGS_QUERY,
    });
  }
}
