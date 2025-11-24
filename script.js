// Infinite scroll for #infi-list
window.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById('infi-list');
  if (!list) return;

  // Helper to create a list item
  function createItem(index) {
    const li = document.createElement('li');
    li.textContent = 'Item ' + index;
    li.style.padding = '8px 4px';
    return li;
  }

  // Count existing items (if any) and ensure at least 10 items
  let count = list.children.length || 0;
  if (count === 0) {
    for (let i = 1; i <= 10; i++) {
      list.appendChild(createItem(i));
      count++;
    }
  } else {
    // if there are existing children, set counter accordingly
    count = list.children.length;
  }

  // Ensure container is scrollable / visible (prefill likely already sets this)
  if (getComputedStyle(list).overflowY === 'visible') {
    list.style.overflowY = 'auto';
  }
  if (list.getBoundingClientRect().height === 0) {
    list.style.minHeight = '200px';
  }

  // Append N items
  function appendItems(n) {
    for (let i = 0; i < n; i++) {
      count++;
      list.appendChild(createItem(count));
    }
  }

  // Scroll handler: when near bottom, add 2 items
  let busy = false;
  const threshold = 30; // px from bottom to trigger

  function onScroll() {
    if (busy) return;
    const scrollTop = list.scrollTop;
    const visible = list.clientHeight;
    const total = list.scrollHeight;

    if (total - (scrollTop + visible) <= threshold) {
      busy = true;
      appendItems(2);
      setTimeout(() => { busy = false; }, 150);
    }
  }

  list.addEventListener('scroll', onScroll, { passive: true });

  // Also run a quick check after load in case content is already short
  setTimeout(onScroll, 60);
});
