// Google Analytics 4, loaded only after the visitor accepts cookies in the banner.
// Nothing is requested from Google until localStorage 'cookie-consent' === 'accepted'.
(function () {
  var GA_ID = 'G-6K0LJ1N805';
  var loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  try {
    if (localStorage.getItem('cookie-consent') === 'accepted') load();
  } catch (e) {}

  // The banner's buttons call clearcoinCookieChoice(); start tracking the moment
  // someone accepts, without waiting for the next page view.
  var original = window.clearcoinCookieChoice;
  window.clearcoinCookieChoice = function (choice) {
    if (typeof original === 'function') original(choice);
    if (choice === 'accepted') load();
  };
})();
