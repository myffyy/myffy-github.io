// Restore the palette before either page paints.
try {
  document.documentElement.classList.toggle('dark', localStorage.getItem('myffy-theme') === 'dark');
} catch {}
document.querySelector('meta[name="theme-color"]').content =
  document.documentElement.classList.contains('dark') ? '#22231f' : '#e8e7e2';
