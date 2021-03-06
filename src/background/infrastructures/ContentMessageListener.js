import messages from '../../shared/messages';
import CommandController from '../controllers/CommandController';
import SettingController from '../controllers/SettingController';
import FindController from '../controllers/FindController';
import AddonEnabledController from '../controllers/AddonEnabledController';
import LinkController from '../controllers/LinkController';
import OperationController from '../controllers/OperationController';
import MarkController from '../controllers/MarkController';

export default class ContentMessageListener {
  constructor() {
    this.settingController = new SettingController();
    this.commandController = new CommandController();
    this.findController = new FindController();
    this.addonEnabledController = new AddonEnabledController();
    this.linkController = new LinkController();
    this.backgroundOperationController = new OperationController();
    this.markController = new MarkController();

    this.consolePorts = {};
  }

  run() {
    browser.runtime.onMessage.addListener((message, sender) => {
      try {
        let ret = this.onMessage(message, sender);
        if (!(ret instanceof Promise)) {
          return {};
        }
        return ret.catch((e) => {
          return browser.tabs.sendMessage(sender.tab.id, {
            type: messages.CONSOLE_SHOW_ERROR,
            text: e.message,
          });
        });
      } catch (e) {
        return browser.tabs.sendMessage(sender.tab.id, {
          type: messages.CONSOLE_SHOW_ERROR,
          text: e.message,
        });
      }
    });
    browser.runtime.onConnect.addListener(this.onConnected.bind(this));
  }

  onMessage(message, sender) {
    switch (message.type) {
    case messages.CONSOLE_QUERY_COMPLETIONS:
      return this.onConsoleQueryCompletions(message.text);
    case messages.CONSOLE_ENTER_COMMAND:
      return this.onConsoleEnterCommand(message.text);
    case messages.SETTINGS_QUERY:
      return this.onSettingsQuery();
    case messages.FIND_GET_KEYWORD:
      return this.onFindGetKeyword();
    case messages.FIND_SET_KEYWORD:
      return this.onFindSetKeyword(message.keyword);
    case messages.ADDON_ENABLED_RESPONSE:
      return this.onAddonEnabledResponse(message.enabled);
    case messages.OPEN_URL:
      return this.onOpenUrl(
        message.newTab, message.url, sender.tab.id, message.background);
    case messages.BACKGROUND_OPERATION:
      return this.onBackgroundOperation(message.operation);
    case messages.MARK_SET_GLOBAL:
      return this.onMarkSetGlobal(message.key, message.x, message.y);
    case messages.MARK_JUMP_GLOBAL:
      return this.onMarkJumpGlobal(message.key);
    case messages.CONSOLE_FRAME_MESSAGE:
      return this.onConsoleFrameMessage(sender.tab.id, message.message);
    }
  }

  async onConsoleQueryCompletions(line) {
    let completions = await this.commandController.getCompletions(line);
    return Promise.resolve(completions.serialize());
  }

  onConsoleEnterCommand(text) {
    return this.commandController.exec(text);
  }


  onSettingsQuery() {
    return this.settingController.getSetting();
  }

  onFindGetKeyword() {
    return this.findController.getKeyword();
  }

  onFindSetKeyword(keyword) {
    return this.findController.setKeyword(keyword);
  }

  onAddonEnabledResponse(enabled) {
    return this.addonEnabledController.indicate(enabled);
  }

  onOpenUrl(newTab, url, openerId, background) {
    if (newTab) {
      return this.linkController.openNewTab(url, openerId, background);
    }
    return this.linkController.openToTab(url, openerId);
  }

  onBackgroundOperation(operation) {
    return this.backgroundOperationController.exec(operation);
  }

  onMarkSetGlobal(key, x, y) {
    return this.markController.setGlobal(key, x, y);
  }

  onMarkJumpGlobal(key) {
    return this.markController.jumpGlobal(key);
  }

  onConsoleFrameMessage(tabId, message) {
    let port = this.consolePorts[tabId];
    if (!port) {
      return;
    }
    port.postMessage(message);
  }

  onConnected(port) {
    if (port.name !== 'vimvixen-console') {
      return;
    }

    let id = port.sender.tab.id;
    this.consolePorts[id] = port;
  }
}
