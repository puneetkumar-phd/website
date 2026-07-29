# Puneet Kumar — Personal Academic Website

A responsive, accessible static website designed for GitHub Pages. It includes a biography homepage, publications with BibTeX records, projects, talks, teaching, a web CV, downloadable PDF CV, dark mode, and a visible visitor counter.

## 1. Preview locally

From this folder, run:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## 2. Personalise the two placeholders

Open `assets/js/site-config.js` and replace:

- `YOUR_GITHUB_PROFILE_URL` with the full GitHub profile URL, or leave it unchanged to hide the GitHub link.
- `YOUR_GOATCOUNTER_CODE` with the GoatCounter site code described below.

The Google Scholar and LinkedIn links were taken from the supplied CV. The phone number is intentionally not displayed on the public website.

## 3. Activate the visitor counter

1. Create a GoatCounter account and site at GoatCounter.
2. Choose a short site code, for example `puneetkumar`.
3. In GoatCounter settings, enable **Allow adding visitor counts on your website**.
4. Replace `YOUR_GOATCOUNTER_CODE` in `assets/js/site-config.js` with that code only, not the full URL.
5. Commit and push the change.

The footer displays the `TOTAL` count for the whole site. GoatCounter may cache the displayed count for several hours. Ad blockers can block analytics scripts.

No API key is stored in the site.

## 4. Publish as a GitHub user site

1. Create a repository named exactly `<your-github-username>.github.io`.
2. Upload the contents of this folder to the repository root.
3. Commit to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.
7. The site will be available at `https://<your-github-username>.github.io/` after deployment finishes.

Command-line option:

```bash
git init
git add .
git commit -m "Launch personal academic website"
git branch -M main
git remote add origin https://github.com/<your-github-username>/<your-github-username>.github.io.git
git push -u origin main
```

## 5. Publish as a project site

The website uses relative internal links, so it can also be hosted from a normal repository such as `personal-website`. Enable GitHub Pages from the repository's `main` branch and root folder. The resulting address will generally be `https://<username>.github.io/personal-website/`.

## 6. Optional custom domain

Configure the domain in **Settings → Pages → Custom domain** before updating DNS. GitHub recommends verifying the domain to reduce takeover risk. Keep **Enforce HTTPS** enabled after the certificate is ready.

## Content notes

- Eight selected publications are included with sample BibTeX metadata.
- Publisher links, Google Scholar, and LinkedIn were extracted from the supplied CV.
- Research metrics are marked as reported in the CV because citation counts change over time.
- Replace or update publications as new records become available.
- A future headshot can replace the `PK` monogram in the homepage hero.

## File structure

```text
.
├── index.html
├── publications.html
├── projects.html
├── talks.html
├── teaching.html
├── cv.html
├── 404.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   ├── js/site-config.js
│   ├── img/favicon.svg
│   ├── img/social-preview.svg
│   ├── img/social-preview.png
│   └── docs/Puneet_Kumar_CV.pdf
├── .nojekyll
├── robots.txt
└── README.md
```
