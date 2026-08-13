import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// React Router 7 uses the Encoding API, which Node provides but jsdom does not
// copy onto its test global.
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

/*
 * jsdom has no IntersectionObserver, and the timeline reveals its tiles with
 * one (see ReactiveTimelineItem). This stub reports everything as visible
 * immediately, which is the state a test wants: content on screen, no waiting
 * on a scroll that cannot happen.
 */
function ImmediateIntersectionObserver(callback) {
  return {
    observe(target) {
      callback([{ target, isIntersecting: true, intersectionRatio: 1 }], this);
    },
    unobserve: () => {},
    disconnect: () => {},
    takeRecords: () => [],
  };
}

global.IntersectionObserver = ImmediateIntersectionObserver;
window.IntersectionObserver = ImmediateIntersectionObserver;
