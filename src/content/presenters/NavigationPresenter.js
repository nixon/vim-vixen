const REL_PATTERN = {
  prev: /^(?:prev(?:ious)?|older)\b|\u2039|\u2190|\xab|\u226a|<</i,
  next: /^(?:next|newer)\b|\u203a|\u2192|\xbb|\u226b|>>/i,
};

// Return the last element in the document matching the supplied selector
// and the optional filter, or null if there are no matches.
const selectLast = (selector, filter) => {
  let nodes = window.document.querySelectorAll(selector);

  if (filter) {
    nodes = Array.from(nodes).filter(filter);
  }

  return nodes.length ? nodes[nodes.length - 1] : null;
};

// Code common to linkPrev and linkNext which navigates to the specified page.
const linkRel = (rel) => {
  let link = selectLast(`link[rel~=${rel}][href]`);

  if (link) {
    window.location = link.href;
    return;
  }

  const pattern = REL_PATTERN[rel];

  link = selectLast(`a[rel~=${rel}][href]`) ||
    // `innerText` is much slower than `textContent`, but produces much better
    // (i.e. less unexpected) results
    selectLast('a[href]', lnk => pattern.test(lnk.innerText));

  if (link) {
    link.click();
  }
};

export default class NavigationPresenter {
  goHistoryPrev() {
    window.history.back();
  }

  goHistoryNext() {
    window.history.forward();
  }

  goLinkPrev() {
    linkRel('prev');
  }

  goLinkNext() {
    linkRel('next');
  }

  goParent() {
    const loc = window.location;
    if (loc.hash !== '') {
      loc.hash = '';
      return;
    } else if (loc.search !== '') {
      loc.search = '';
      return;
    }

    const basenamePattern = /\/[^/]+$/;
    const lastDirPattern = /\/[^/]+\/$/;
    if (basenamePattern.test(loc.pathname)) {
      loc.pathname = loc.pathname.replace(basenamePattern, '/');
    } else if (lastDirPattern.test(loc.pathname)) {
      loc.pathname = loc.pathname.replace(lastDirPattern, '/');
    }
  }

  goRoot() {
    window.location = window.location.origin;
  }
}
