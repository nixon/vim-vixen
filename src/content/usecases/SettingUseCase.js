import operations from 'shared/operations';
import * as properties from '../../shared/settings/properties';
import SettingRepository from '../repositories/SettingRepository';
import SettingClient from '../clients/SettingClient';

const reservedKeymaps = {
  '<Esc>': { type: operations.CANCEL },
  '<C-[>': { type: operations.CANCEL },
};

export default class SettingUseCase {
  constructor() {
    this.settingRepsitory = new SettingRepository();
    this.settingClient = new SettingClient();
  }

  updateSetting(settings) {
    let next = { ...settings };
    next.keymaps = {
      ...settings.keymaps,
      ...reservedKeymaps,
    };
    next.properties = next.properties || {};
    next.blacklist = next.blacklist || [];
    for (let key of Object.keys(properties.defaults)) {
      next.properties[key] = next.properties[key] || properties.defaults[key];
    }
    this.settingRepsitory.set(next);
    return Promise.resolve();
  }

  async loadSetting() {
    let settings = await this.settingClient.getSetting();
    return this.updateSetting(settings);
  }
}
