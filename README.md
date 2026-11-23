# Swedwatch — Tin mining

A static photographic exhibition with five chapters and 17 photographs by Muhammad Fadli. Built with HTML, CSS and vanilla JavaScript. No installation, build process or runtime dependencies are required.

## Preview locally

Open **index.html** in a modern browser. Keep the website files and **web-assets/** together. JavaScript must be enabled. The website uses ordinary script tags, relative image paths and fragment links, so it does not require a web server or internet connection for local viewing.

Choose a chapter using the entrance thumbnails, then scroll through the photographs. The dots navigate within a chapter; the previous/next controls move between chapters. The logo returns to the entrance. Controls support Tab and Enter, and the website respects the system's reduced-motion preference.

## Files

| File or folder | Purpose |
| --- | --- |
| `index.html` | Page structure, metadata and script loading |
| `exhibition-data.js` | Exhibition text, images, captions, quotations, credits and composition settings |
| `style.css` | Layout, typography, gradients, responsive rules and transitions |
| `script.js` | Rendering, navigation, image loading and progress indicators |
| `web-assets/branding/` | Official Swedwatch logo |
| `web-assets/chapters/` | Optimized website photographs |
| `.gitignore` | Publication exclusions |
| `.nojekyll` | Direct static-file serving on GitHub Pages |

## Edit text and quotations

Open **exhibition-data.js** in a text editor. The top-level settings contain the homepage title, subtitle, introduction and links. `titleLines` and `subtitleLines` control visible line breaks. Keep `title` and `subtitle` consistent with those lines. Interface wording is in `labels`.

Each object in `chapters` contains an `id`, `title`, `description`, `thumbnail` and `photos` array. Edit the strings while preserving commas, brackets and quotation marks. Escape double quotes within strings as `\"`, or use typographic quotation marks such as “these”.

Each photograph supports `quote`, `attribution`, `caption`, `credit` and descriptive `alt` text. Leave `quote: ""` to display the caption as the main overlay without quotation marks. An optional `captionLabel` appears above a narrative caption. Set `anonymous: true` for thematic testimony that should not identify the person pictured.

## Replace a photograph

1. Export web-ready copies into the appropriate folder under **web-assets/chapters/**. Preserve the original separately.
2. Update the photograph's `src` in **exhibition-data.js** using a relative path, such as `web-assets/chapters/01-introduction/0395-1600.webp`.
3. Update every filename and width in `srcset`. If only one image size is available, remove the `srcset` property. Otherwise the browser may continue displaying an old image.
4. Update `alt`, `caption` and `credit` to match the new image.
5. When replacing an opening photograph, update the chapter's `thumbnail` and `thumbnailPosition` as needed.

The homepage background is configured separately in `hero`. Changing a chapter photograph does not change that background.

The included photographs use WebP versions at **960, 1600 and 2560 pixels wide**, with small thumbnails for chapter navigation. Responsive copies retain the original 5:4 aspect ratio; CSS crops each image to fill its scene. Avoid uploading full-resolution originals or images containing unnecessary location metadata.

### Adjust composition

| Setting | Example | Purpose |
| --- | --- | --- |
| `desktopPosition` | `"center top"` | Desktop focal point using CSS `object-position` |
| `mobilePosition` | `"67% center"` | Mobile focal point |
| `quotePosition` | `"right"` or `"left"` | Overlay column on subsequent desktop photographs |
| `gradientStrength` | `0.45` | Side-gradient darkness, between 0 and 1 |
| `mobileTextPosition` | `"bottom"` | Adds space above mobile text |
| `mobileTextOffset` | `"70svh"` | Optional mobile spacing measured against viewport height |
| `introWidth` | `"440px"` | Optional opening-copy width |
| `introPosition` | `"lower"` | Lowers opening copy on desktop |

Opening screens place the introduction on the left and testimony on the right. On phones the text flows vertically over the image. Longer text can make a scene taller than the screen. Check cropping and face clearance after changing text or photographs.

## Add or remove photographs

Copy a photo object within a chapter's `photos` array, including its braces. Add a comma between neighbouring objects, then replace its content and image settings. Array order determines display order. Counters, dots and navigation destinations update automatically.

To remove a photograph, delete its complete object and the appropriate separating comma. Keep at least one photograph per chapter. Review the chapter thumbnail after reordering. Photograph fragments identify positions in a chapter, so reordering may change what an existing bookmark opens.

## Update header links

Set the complete URLs in the `links` object:

```javascript
links: {
  fullReport: "",
  support: ""
},
```

Empty values keep these links non-navigating and expose a “Link to be added” accessible label. Replace them with the final `https://` addresses when available.

## Logo and styling

The header uses **web-assets/branding/swedwatch blue transparent back.png**. The `.brand-white` filter displays the transparent artwork in white while preserving its proportions and source file. To use an official white asset instead, update `branding.logo` and set `whiteFilter: false`.

Edit **style.css** for visual changes. Main spacing, colors and fonts are defined in `:root`. Rules are grouped into entrance, photographic chapters, tablet, phone, reduced-motion and print sections. The system font stack does not make external requests.

## Publish on GitHub Pages

1. Create a GitHub repository.
2. Add `index.html`, `style.css`, `script.js`, `exhibition-data.js`, `README.md`, `.gitignore`, `.nojekyll` and the complete **web-assets/** folder. Keep `index.html` at the repository root.
3. Commit and push to the `main` branch.
4. In **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save.
5. Open the published address when GitHub provides it. No custom build workflow or generated output directory is needed.

Relative paths support repository addresses such as `https://username.github.io/repository-name/`. See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for account and repository settings.

The root `.gitignore` allows only the listed website files and **web-assets/**. Original photographs in **Assets/**, local records in **.local/**, PDFs and operating-system files are excluded. If adding a new root-level website file, add an explicit exception in `.gitignore`.

When uploading through GitHub's website, select the website files explicitly: browser uploads do not apply `.gitignore`. Never upload the original archive or local records. If excluded files were previously committed, ignoring them does not remove them from Git history. Use your Git client's **stop tracking / keep local file** operation before publishing an updated version.

## Upload updates

Save changes, refresh the local page and check the affected scenes. Commit the changed website files and push to `main`, or upload them into their existing folders through GitHub's website. Keep filename capitalization identical to the image paths. GitHub Pages republishes the changes; refresh the published page after deployment.

Before publishing, check desktop and mobile crops, quotation readability, keyboard navigation, all photograph links and image loading. Confirm direct local opening and the published repository URL in the browsers you support.
