// Rewrites the body of contact.html: who each channel is for, plus a form that
// actually does something on a static host — it composes a mailto: link from
// the fields and hands it to the visitor's mail client.
import fs from "node:fs";

const EMAIL = "hello@clearcoin.help";

const BODY = `<article class="article" id="main">
    <span class="kicker">Contact</span>
    <h1>Contact</h1>
    <p class="meta">We read every message and usually reply within a few days.</p>

    <p>Clearcoin is a small operation, so there is no ticket queue and no phone line — just an inbox. Pick whichever of these fits and we will get back to you.</p>

    <div class="contact-channels">
      <div class="channel">
        <h3>Questions about a guide</h3>
        <p>Something unclear, or a situation an article did not cover? Tell us which guide you were reading.</p>
      </div>
      <div class="channel">
        <h3>Report an error</h3>
        <p>A number that looks wrong, a broken link, a rule that has changed. Include the page and what you spotted — these go to the top of the pile.</p>
      </div>
      <div class="channel">
        <h3>Partnerships and press</h3>
        <p>Advertising, syndication, or a question about how we make money. See our <a href="editorial-guidelines.html">editorial guidelines</a> first — they explain what we will and will not do.</p>
      </div>
    </div>

    <h2>Send a message</h2>

    <form class="contact-form" id="contact-form" novalidate>
      <div class="field">
        <label for="cf-name">Your name</label>
        <input type="text" id="cf-name" name="name" autocomplete="name" required>
      </div>

      <div class="field">
        <label for="cf-email">Your email</label>
        <input type="email" id="cf-email" name="email" autocomplete="email" required>
      </div>

      <div class="field">
        <label for="cf-topic">What is this about?</label>
        <select id="cf-topic" name="topic">
          <option>Question about a guide</option>
          <option>Report an error</option>
          <option>Partnership or press</option>
          <option>Something else</option>
        </select>
      </div>

      <div class="field">
        <label for="cf-message">Message</label>
        <textarea id="cf-message" name="message" required></textarea>
      </div>

      <button type="submit" class="btn">Open in my email app</button>
      <p class="form-note" id="cf-note">This button opens your email app with the message already filled in — nothing is sent from this page, and nothing is stored here. If nothing opens, email us directly at <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
    </form>

    <h2>Prefer plain email?</h2>
    <p>Write to <a href="mailto:${EMAIL}">${EMAIL}</a>. It reaches the same inbox.</p>
  </article>`;

const SCRIPT = `<script>
/* Contact form: no backend here, so compose a mailto: from the fields. */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var note = document.getElementById('cf-note');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var topic = form.elements.topic.value;
    var message = form.elements.message.value.trim();

    if (!name || !email || !message) {
      note.textContent = 'Please fill in your name, your email and a message first.';
      note.style.color = 'var(--accent-deep)';
      (!name ? form.elements.name : !email ? form.elements.email : form.elements.message).focus();
      return;
    }

    var body = message + '\\n\\n—\\n' + name + '\\n' + email;
    var href = 'mailto:${EMAIL}'
      + '?subject=' + encodeURIComponent(topic + ' — ' + name)
      + '&body=' + encodeURIComponent(body);
    window.location.href = href;
  });
})();
</script>`;

const file = "contact.html";
const raw = fs.readFileSync(file, "utf8");
const crlf = raw.includes("\r\n");
let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;

const a = s.indexOf('<article class="article"');
const b = s.indexOf("</article>", a);
if (a < 0 || b < 0) throw new Error("article element not found in contact.html");
s = s.slice(0, a) + BODY + s.slice(b + "</article>".length);

if (!s.includes("Contact form: no backend here")) {
  s = s.replace("</body>", `${SCRIPT}\n</body>`);
}

fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
console.log("contact.html rewritten with a working mailto form");
