import messages from 'shared/messages';
import FindUseCase from '../../usecases/FindUseCase';

export default class FindComponent {
  constructor() {
    this.findUseCase = new FindUseCase();

    messages.onMessage(this.onMessage.bind(this));
  }

  onMessage(message) {
    switch (message.type) {
    case messages.CONSOLE_ENTER_FIND:
      return this.findUseCase.renew(message.text);
    case messages.FIND_NEXT:
      return this.findUseCase.next();
    case messages.FIND_PREV:
      return this.findUseCase.prev();
    }
  }
}
