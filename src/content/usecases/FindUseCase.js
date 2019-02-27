import ConsolePresenter from '../presenters/ConsolePresenter';
import FindPresenter from '../presenters/FindPresenter';
import BackgroundPresenter from '../presenters/BackgroundPresenter';

let lastKeyword = undefined;

export default class FindUseCase {
  constructor() {
    this.consolePresenter = new ConsolePresenter();
    this.findPresenter = new FindPresenter();
    this.backgroundPresenter = new BackgroundPresenter();
  }

  async renew(keyword = undefined) {
    if (keyword) {
      lastKeyword = keyword;
    } else {
      lastKeyword = await this.backgroundPresenter.getLastFindKeyword();
    }
    if (!lastKeyword) {
      return this.consolePresenter.showError('No previous search keywords');
    }
    lastKeyword = keyword;


    this.findPresenter.clear();
    return this.next();
  }

  next() {
    return this.findInternal(false);
  }

  prev() {
    return this.findInternal(true);
  }

  async findInternal(backwards) {
    if (!lastKeyword) {
      lastKeyword = await this.backgroundPresenter.getLastFindKeyword();
    }
    if (!lastKeyword) {
      return this.consolePresenter.showError('No previous search keywords');
    }

    let found = backwards
      ? this.findPresenter.prev(lastKeyword)
      : this.findPresenter.next(lastKeyword);
    if (!found) {
      return this.consolePresenter.showError(
        'Pattern not found: ' + lastKeyword);
    }
    await this.consolePresenter.showInfo('Pattern found: ' + lastKeyword);
    return this.backgroundPresenter.setLastFindKeyword(lastKeyword);
  }
}
