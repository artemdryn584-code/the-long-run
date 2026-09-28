/* Clearcoin Plus — Paddle checkout + entitlement (client side).
 *
 * The site is static (GitHub Pages), so this is a pragmatic MVP:
 *  - Checkout is opened with Paddle.js (lazy-loaded only when a buy button
 *    is actually clicked, so ordinary visitors load no third-party script).
 *  - After a successful purchase Paddle redirects to plus-welcome.html with a
 *    ?_ptxn=... transaction id; that page grants entitlement (a localStorage
 *    flag) so Plus features unlock on this browser.
 *  - Entitlement here is per-browser and not tamper-proof. Cross-device and
 *    tamper-proof access needs a small server check (Paddle webhook) — planned
 *    for later. Nothing free ever moves behind this.
 *
 * To go LIVE: create the product/prices in the Paddle LIVE account, then set
 * env:'production', swap token + price ids, and flip live:true below.
 */
(function () {
  var CFG = {
    env: 'sandbox', // 'sandbox' | 'production'
    token: 'test_912dc6b678fcf8741f252b4e9a0',
    prices: {
      monthly: 'pri_01m3m5bj93a0ze7mwhz62ayfba',
      yearly: 'pri_01m3m57s3dzhsyv1jntbzhzz49'
    },
    // While false the pricing page keeps the "join the waitlist" call to action
    // and no buy buttons are shown. Flip to true at launch.
    live: false
  };
  window.CLEARCOIN_PLUS = CFG;

  var KEY = 'clearcoin_plus';

  function isPlus() {
    try { return localStorage.getItem(KEY) === 'active'; } catch (e) { return false; }
  }
  function grantPlus() {
    try { localStorage.setItem(KEY, 'active'); } catch (e) {}
    document.documentElement.classList.add('plus-active');
  }
  function revokePlus() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    document.documentElement.classList.remove('plus-active');
  }
  function applyEntitlement() {
    if (isPlus()) document.documentElement.classList.add('plus-active');
  }

  window.clearcoinIsPlus = isPlus;
  window.clearcoinGrantPlus = grantPlus;
  window.clearcoinRevokePlus = revokePlus;

  // reflect entitlement as early as possible (ad-free, unlocked UI)
  applyEntitlement();

  // --- Paddle checkout (lazy) --------------------------------------------
  var paddleReady = false;
  function ensurePaddle(cb) {
    if (paddleReady && window.Paddle) { cb(); return; }
    function boot() {
      try {
        window.Paddle.Environment.set(CFG.env === 'production' ? 'production' : 'sandbox');
        window.Paddle.Initialize({
          token: CFG.token,
          eventCallback: function (data) {
            if (data && data.name === 'checkout.completed') grantPlus();
          }
        });
        paddleReady = true;
        cb();
      } catch (e) { /* Paddle failed to init */ }
    }
    if (window.Paddle) { boot(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    s.async = true;
    s.onload = boot;
    document.head.appendChild(s);
  }

  window.clearcoinOpenCheckout = function (plan) {
    var priceId = CFG.prices[plan];
    if (!priceId) return;
    ensurePaddle(function () {
      window.Paddle.Checkout.open({
        items: [{ priceId: priceId, quantity: 1 }],
        settings: { successUrl: location.origin + '/plus-welcome.html' }
      });
    });
  };

  // --- Pricing page wiring -----------------------------------------------
  // Buy buttons live in the page but stay hidden until we go live; the
  // waitlist stays the primary CTA until then.
  document.addEventListener('DOMContentLoaded', function () {
    var buy = document.querySelector('.plan-buy');
    if (buy && CFG.live) {
      buy.style.display = '';
      // hide the waitlist CTA + signup box once real checkout is live
      var waitCta = document.querySelector('.plan-cta[href="#waitlist-form"]');
      if (waitCta) waitCta.style.display = 'none';
      var note = document.querySelector('.plan-cta-note');
      if (note) note.style.display = 'none';
      var signup = document.querySelector('.side-box.signup');
      if (signup) signup.style.display = 'none';
    }
    if (buy) {
      [].slice.call(buy.querySelectorAll('[data-plan]')).forEach(function (btn) {
        btn.addEventListener('click', function () {
          window.clearcoinOpenCheckout(btn.getAttribute('data-plan'));
        });
      });
    }
  });
})();
