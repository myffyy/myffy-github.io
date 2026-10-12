const theme = document.querySelector('#theme');

function syncTheme() {
  const dark = document.documentElement.classList.contains('dark');
  theme.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#22231f' : '#e8e7e2';
}

syncTheme();
theme.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  syncTheme();
  try {
    localStorage.setItem('myffy-theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  } catch {}
});

document.querySelector('#year').textContent = new Date().getFullYear();

const availabilityLabel = document.querySelector('#availability-label');
const moscowClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Moscow',
  hour: '2-digit',
  hourCycle: 'h23'
});

function isOnlineInMoscow(date) {
  const hour = Number(moscowClock.formatToParts(date).find(part => part.type === 'hour').value);
  return hour >= 10;
}

function updateAvailability() {
  const online = isOnlineInMoscow(new Date());
  document.body.classList.toggle('is-online', online);
  document.body.classList.toggle('is-offline', !online);
  const label = online ? 'ONLINE' : 'OFFLINE';
  if (availabilityLabel.textContent !== label) availabilityLabel.textContent = label;
}

updateAvailability();
setInterval(updateAvailability, 1000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateAvailability();
});
window.addEventListener('pageshow', updateAvailability);
