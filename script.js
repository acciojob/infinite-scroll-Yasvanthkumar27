//your code here!
// Infinite scroll helper — paste this into the JS pane
(function() {
  // Try a bunch of likely selectors used in the exercises
  const container = document.querySelector(
    '.infinite-list, .list, #list, .items, .container, .infinite, .scrollbox'
  ) || document.querySelector('ul, .box, .card'); // last resort

  if (!container) {
    console.warn('Infinite scroll: no container found.');
    return;
  }

  // Find (or create) a child wrapper to hold items. Many prefills put <div class="items"> with children.
  // We'll use the container itself as the scrollable area and append item elements directly.
  const getExistingItems = () =>
    Array.from(container.querySelectorAll('.item, li, .list-item')).filter(el => el.offsetParent !== null);

  // Helper: create an item element that matches common prefill styles
  function createItem(index) {
    // Prefer <div class="item"> to match many tests; fallback to <li> if container is a UL
    const el = container.tagName.toLowerCase() === 'ul' ? document.createElement('li') : document.createElement('div');
    el.className = 'item';
    el.textContent = Item ${index};
    // minimal inline styles in case stylesheet expects them absent
    if (!el.style.height) el.style.padding = '12px 16px';
    return el;
  }

  // Determine starting index from existing items (so we don't duplicate numbering)
  let existing = getExistingItems();
  let counter = existing.length;
  if (counter === 0) {
    // maybe there are nodes but with different classes; try any children
    existing = Array.from(container.children).filter(c => c.nodeType === 1);
    counter = existing.length;
  }

  // Ensure at least 10 items present by default
  function ensureInitialItems(min = 10) {
    while (counter < min) {
      counter += 1;
      container.appendChild(createItem(counter));
    }
  }

  ensureInitialItems(10);

  // Append n items
  function appendItems(n = 2) {
    for (let i = 0; i < n; i++) {
      counter += 1;
      container.appendChild(createItem(counter));
    }
  }

  // Scroll detection: when user is near bottom, append 2 items.
  let busy = false;
  const thresholdPx = 30; // trigger when within 30px of bottom

  function onScroll() {
    if (busy) return;
    const scrollTop = container.scrollTop;
    const visibleHeight = container.clientHeight;
    const contentHeight = container.scrollHeight;

    if (contentHeight - (scrollTop + visibleHeight) <= thresholdPx) {
      busy = true;
      // append items, then allow new events after a small timeout
      appendItems(2);
      // small timeout prevents rapid multiple appends in fast events
      setTimeout(() => { busy = false; }, 120);
    }
  }

  // If the container isn't actually scrollable, ensure style so Cypress or user can scroll:
  if (getComputedStyle(container).overflowY === 'visible') {
    container.style.overflowY = 'auto';
  }
  // If the container has zero height, give it a modest min-height so it's usable in test runners
  const rect = container.getBoundingClientRect();
  if (rect.height === 0) {
    container.style.minHeight = '240px';
  }

  container.addEventListener('scroll', onScroll, { passive: true });

  // Also support wheel events (some test envs use wheel)
  container.addEventListener('wheel', () => setTimeout(onScroll, 50), { passive: true });

  // Expose for manual testing in console (optional)
  window.__infiniteAppend = () => appendItems(2);

  // ensure initial check (in case content already shorter than container)
  setTimeout(onScroll, 50);
})();


