// Standalone connection sequence. The parent only handles displaying this page.
(async () => {
  const loader = document.querySelector('#connection-loader');
  const fill = document.querySelector('#loader-fill');
  const percent = document.querySelector('#loader-percent');
  const progress = document.querySelector('#loader-progress');
  const embedded = window.parent !== window;
  loader.classList.add('is-running');
  loader.classList.toggle('is-embedded', embedded);

  const started = performance.now();
  const milestones = [[0, 0], [220, 9], [500, 27], [850, 31], [1250, 57],
    [1580, 61], [2000, 79], [2350, 86], [2700, 94]];
  const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
  let ready = false;
  let displayed = 0;
  let deadline;

  function render(value) {
    displayed = Math.max(displayed, Math.min(100, Math.round(value)));
    fill.style.transform = `scaleX(${displayed / 100})`;
    percent.textContent = `${displayed}%`;
    progress.setAttribute('aria-valuenow', String(displayed));
  }

  function updateProgress() {
    const elapsed = performance.now() - started;
    let target = 0;
    for (let i = 1; i < milestones.length; i++) {
      const [fromTime, fromValue] = milestones[i - 1];
      const [toTime, toValue] = milestones[i];
      if (elapsed >= toTime) { target = toValue; continue; }
      const t = Math.max(0, (elapsed - fromTime) / (toTime - fromTime));
      target = fromValue + (toValue - fromValue) * (1 - (1 - t) ** 3);
      break;
    }
    render(Math.min(ready ? 94 : 86, target));
  }

  const avatar = new Image();
  avatar.src = 'images/avatar.png';
  const assets = Promise.allSettled([
    avatar.decode(),
    document.fonts.load('700 36px "Space Grotesk"')
  ]).then(() => { ready = true; });
  const tick = setInterval(updateProgress, 50);

  try {
    await Promise.race([assets, new Promise(resolve => { deadline = setTimeout(resolve, 5500); })]);
    clearTimeout(deadline);
    await wait(Math.max(0, 2800 - (performance.now() - started)));
    clearInterval(tick);
    render(100);
    document.querySelector('#loader-message').textContent = 'CONNECTION ESTABLISHED.';
    loader.classList.add('is-connected');
    await wait(1000);
    if (embedded) {
      const origin = location.origin === 'null' ? '*' : location.origin;
      window.parent.postMessage({ type: 'myffy:connected' }, origin);
    }
  } finally {
    clearInterval(tick);
    clearTimeout(deadline);
    loader.classList.remove('is-running');
  }
})();
