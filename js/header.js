// Simple client-side include for header.html
// Requires Alpine.js on the page because the header uses Alpine directives
(function() {
  function injectHeader(container, html) {
    container.innerHTML = html;
  }

  async function loadHeader() {
    var container = document.getElementById('site-header');
    if (!container) return;
    try {
      // Use absolute path to work from nested routes too
      var res = await fetch('/header.html', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var html = await res.text();
      injectHeader(container, html);
    } catch (e) {
      console.error('Failed to load header.html:', e);
      container.innerHTML = '<!-- header failed to load -->';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
  } else {
    loadHeader();
  }
})();