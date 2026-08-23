# GitHub Sale Gallery

A simple, read-only product gallery designed for GitHub Pages.

## What is included

- Responsive desktop/mobile layout
- Product cards
- Price, description, condition, and status
- Available / Pending / Sold filters
- Search box
- Multiple photos per item
- Large photo viewer with thumbnails
- No database
- No server-side code
- No public admin panel
- `noindex,nofollow` meta tag to discourage search-engine indexing

## Deploy to GitHub Pages

1. Create a new GitHub repository, for example `sale-gallery`.
2. Upload all files in this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
5. Save.

Your site will normally appear at:

`https://YOUR-USERNAME.github.io/sale-gallery/`

## Add or edit an item

Open `products.json` and add/edit an object.

Example:

```json
{
  "id": "garmin-fenix-7",
  "name": "Garmin Fenix 7",
  "price": "$325",
  "description": "Excellent condition. Charger included.",
  "condition": "Excellent",
  "status": "Available",
  "images": [
    "images/garmin-front.jpg",
    "images/garmin-back.jpg"
  ]
}
```

Valid status values used by the interface:

- `Available`
- `Pending`
- `Sold`

## Add photos

Upload image files into the `images` folder.

Recommended:
- JPG or WebP
- 1200–2000 pixels on the long edge
- Compress large phone photos before uploading for faster loading

Then reference the file in `products.json`:

```json
"images": [
  "images/my-item-1.jpg",
  "images/my-item-2.jpg"
]
```

## Remove an item

Delete its entire object from `products.json`.

Alternatively, keep it visible and change:

```json
"status": "Sold"
```

## Security model

The public website contains no login, upload, edit, or delete functionality.

Only users with write access to the GitHub repository can change the site. Protect your GitHub account with MFA or a passkey.

Important: if this repository is public, the raw files and photos are public too. The `noindex` tag discourages search indexing but is not access control.

## Test locally

Because the page loads `products.json` with JavaScript, opening `index.html` directly with `file://` may not work in some browsers.

Run a simple local web server from this folder instead.

Python:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## Customize

- Site title/intro: edit `index.html`
- Colors/layout: edit `styles.css`
- Product behavior: edit `app.js`
- Products: edit `products.json`

