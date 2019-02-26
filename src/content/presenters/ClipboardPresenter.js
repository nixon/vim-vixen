export default class ClipboardPresenter {
  write(value) {
    let textarea = this.appendAndFocusTextarea(window);
    textarea.value = value;
    textarea.select();

    let b = window.document.execCommand('copy');
    textarea.remove();

    if (!b) {
      throw new Error('Failed to access clipboard');
    }
  }

  read() {
    let textarea = this.appendAndFocusTextarea();
    textarea.focus();

    let b = window.document.execCommand('paste');
    let value = textarea.textContent;
    textarea.remove();
    if (!b) {
      throw new Error('Failed to access clipboard');
    }
    return value;
  }

  appendAndFocusTextarea() {
    let textarea = window.document.createElement('textarea');
    window.document.body.append(textarea);

    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.contentEditable = true;

    return textarea;
  }
}
