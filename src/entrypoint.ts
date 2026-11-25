/**
 * Alpine.js entrypoint, runs before Alpine.start()
 *
 * Register Alpine.data() components, Alpine.store() stores, and
 * Alpine.directive() custom directives here
 *
 * This is the officially supported pattern from @astrojs/alpinejs
 * https://docs.astro.build/en/guides/integrations-guide/alpinejs/
 * Without it, Alpine.data() registrations can race against DOM
 * processing, esp in Safari and during virtual navigation
 */

import type { Alpine } from 'alpinejs';

const INDEX_KEY = 'frasi-index';
const MATCH_KEY = 'frasi-word-match';

// Card browser state, shared between the header tools and the page
const frasi = {
  view: 'browse',
  i: 0,
  total: 0,
  wordMatch: false,

  init() {
    try {
      this.i = parseInt(localStorage.getItem(INDEX_KEY) ?? '0', 10) || 0;
      this.wordMatch = localStorage.getItem(MATCH_KEY) === 'on';
    } catch {}
  },

  setup(total: number) {
    this.total = total;
    this.go(this.i);
  },

  go(i: number) {
    if (!this.total) return;
    this.i = (i + this.total) % this.total;
    try {
      localStorage.setItem(INDEX_KEY, String(this.i));
    } catch {}
  },

  prev() {
    this.go(this.i - 1);
  },

  next() {
    this.go(this.i + 1);
  },

  print() {
    this.view = 'sheets';
    setTimeout(() => window.print(), 400);
  },
};

export default (Alpine: Alpine) => {
  Alpine.store('frasi', frasi);

  Alpine.effect(() => {
    const { wordMatch } = Alpine.store('frasi') as typeof frasi;
    try {
      localStorage.setItem(MATCH_KEY, wordMatch ? 'on' : 'off');
    } catch {}
  });
};
