//
// window.find(aString, aCaseSensitive, aBackwards, aWrapAround,
//             aWholeWord, aSearchInFrames);
//
// NOTE: window.find is not standard API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/find

export default class FindPresenter {
  clear() {
    window.getSelection().removeAllRanges();
  }

  next(keyword) {
    return this.findInternal(keyword, false);
  }

  prev(keyword) {
    return this.findInternal(keyword, true);
  }

  findInternal(keyword, backwards) {
    let caseSensitive = false;
    let wrapScan = true;

    // NOTE: aWholeWord dows not implemented, and aSearchInFrames does not work
    // because of same origin policy
    let found = window.find(keyword, caseSensitive, backwards, wrapScan);
    if (found) {
      return found;
    }
    window.getSelection().removeAllRanges();
    return window.find(keyword, caseSensitive, backwards, wrapScan);
  }
}
