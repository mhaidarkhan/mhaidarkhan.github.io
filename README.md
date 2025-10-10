# haidar-portfolio — Muhammad Haidar Khan

Static multi-page portfolio ready for GitHub Pages.

## Quick setup
1. Place your headshot at `assets/images/haidar.jpg` (I used your uploaded photo).
2. Add placeholder case images at `assets/images/case1.jpg` and `assets/images/case2.jpg` (optional).
3. Update `contact.html` form `action` to your Formspree form endpoint (see below).
4. Push to GitHub and enable Pages.

## Formspree (how to receive messages at mhkvlog@gmail.com)
1. Go to https://formspree.io and create a free account.
2. Create a new form and set the destination email to **mhkvlog@gmail.com**.
3. Formspree will give you a form endpoint like `https://formspree.io/f/abc123`. Replace `YOUR_FORM_ID` in `contact.html` with that endpoint.
4. Optionally, test the form locally with a static server (see below).

> Alternative quick method (may require extra Formspree config): use `action="https://formspree.io/mhkvlog@gmail.com"` — but creating a form in the Formspree dashboard is recommended.

## Local preview
Run a simple static server in the project folder:
```bash
# python 3
python -m http.server 8000
# then open http://localhost:8000/index.html
