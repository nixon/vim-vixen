import SettingUseCase from '../usecases/SettingUseCase';
import messages from '../../shared/messages';

export default class SettingController {
  constructor() {
    this.settingUseCase = new SettingUseCase();

    browser.runtime.onMessage.addListener((message) => {
      switch (message.type) {
      case messages.SETTINGS_CHANGED:
        this.onSettingsChanged(message);
      }
    });
  }

  onSettingsChanged({ settings }) {
    this.settingUseCase.updateSetting(settings);
    return Promise.resolve({});
  }
}
