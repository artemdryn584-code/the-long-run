# The Long Run — starter site

A static personal-finance blog template: home page, one full sample article, and the About / Contact / Privacy pages AdSense expects to see.

## Files
- `index.html` — homepage
- `article.html` — full sample article (emergency fund guide)
- `about.html`, `contact.html`, `privacy.html` — required supporting pages
- `style.css` — all styling, no build step needed

## Deploy on GitHub Pages (free, no cost except your domain)

1. Create a free GitHub account if you don't have one.
2. Create a new repository, e.g. `the-long-run`.
3. Upload all files in this folder to the repository (drag-and-drop works on github.com, or use `git push`).
4. In the repo, go to **Settings → Pages**.
5. Under "Build and deployment," set Source to **Deploy from a branch**, branch `main`, folder `/root`.
6. Save. Your site will be live within a minute or two at `https://yourusername.github.io/the-long-run/`.

## Connect your own domain (the only real cost, ~$10-12/year)

1. Buy a domain from Namecheap or Porkbun.
2. In the repo, go to **Settings → Pages → Custom domain**, enter your domain, save (this creates a `CNAME` file automatically).
3. At your domain registrar, add these DNS records:
   - Four `A` records for `@` pointing to GitHub's IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `yourusername.github.io`
4. Back in GitHub Pages settings, check "Enforce HTTPS" once it becomes available (can take a few hours).

## Before applying to Google AdSense

- Replace `hello@yourdomain.com` in `contact.html` and `privacy.html` with your real email.
- Update the Privacy Policy placeholders to match your actual data practices.
- Publish at least 15-20 real articles (see `content-plan.md` for topic ideas).
- Make sure the site has been live and getting at least some traffic for a couple of weeks.
- Apply at console.adsense.com, then paste the AdSense verification code it gives you into the `<head>` of every page.
- Once approved, replace the `.ad-slot` placeholder `<div>`s with your actual AdSense ad unit code.
