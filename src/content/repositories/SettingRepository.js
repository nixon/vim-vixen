let current = undefined;

export default class SettingRepository {
  get() {
    return current;
  }

  set(value) {
    current = value;
  }
}
