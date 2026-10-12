// Embed the standalone loading page; keep the business-card code independent.
(() => {
  const root = document.documentElement;
  root.classList.add('is-loading');
  let finished = false;
  let timeout;

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    window.removeEventListener('message', onMessage);
    const frame = document.querySelector('#loading-frame');
    frame?.classList.add('is-leaving');
    setTimeout(() => {
      frame?.remove();
      root.classList.remove('is-loading');
      document.querySelectorAll('body > header, body > main, body > footer')
        .forEach(section => { section.inert = false; });
    }, 350);
  }

  function onMessage(event) {
    const frame = document.querySelector('#loading-frame');
    if (event.source !== frame?.contentWindow || event.origin !== location.origin) return;
    if (event.data?.type === 'myffy:connected') finish();
  }

  window.addEventListener('message', onMessage);
  document.addEventListener('DOMContentLoaded', () => {
    if (finished) return;
    document.querySelectorAll('body > header, body > main, body > footer')
      .forEach(section => { section.inert = true; });
  }, { once: true });
  // A missing loading page must never block access to the contact.
  timeout = setTimeout(finish, 8000);
})();
