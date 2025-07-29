import '@testing-library/jest-dom';
import 'whatwg-fetch';


// jest.setup.ts or jest.setup.js
if (typeof window !== "undefined") {
  if (!window.IntersectionObserver) {
    class IntersectionObserver {
      constructor() {}
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() { return []; }
    }
    // @ts-ignore
    window.IntersectionObserver = IntersectionObserver;
    // @ts-ignore
    window.IntersectionObserverEntry = function () {};
  }
}


if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function() {}, // Deprecated
      removeListener: function() {}, // Deprecated
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {},
    };
  };
}
