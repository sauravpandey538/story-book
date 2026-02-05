# Story Book

A digital memory book — an interactive, page-turning book for your love story.

## Customizing the website

### Change all site data: `src/data/data.ts`

**Edit only `src/data/data.ts`** to control all text and links on the site:

- **Names** — `PARTNER_ONE` and `PARTNER_TWO` at the top (header, hero, footer, dedication).
- **Site** — `site.title`, `site.description`, `site.author` (used for the tab title and meta).
- **Header** — `header.navCta`, `header.githubUrl`, `header.linkedinUrl`.
- **Hero** — headline, quote, tagline, CTA button text.
- **Footer** — branding line, copyright text, “Made with” credit.
- **Book** — cover title/subtitle, dedication, closing lines, back endpaper (e.g. Valentine) text, “Read again” prompt.
- **Our Story section** — heading, blessing line, instruction under the book.

Change these values and save; the app will reflect them everywhere.

---

### Memories (book pages): `src/data/memories.ts` + images in `/public`

Memories are the pages inside the book. Each memory has: `id`, `date`, `title`, `intro`, `images`, and optional `caption`.

1. **Add your images**  
   Put image files in the **`/public`** folder. You can use subfolders, e.g.  
   `public/2024/dec/`, `public/photos/`, etc.

2. **Reference them in `memories.ts`**  
   In `src/data/memories.ts`, set `images` to paths **starting with `/`**, using the path under `public`:
   - File at `public/2024/dec/photo.jpg` → use **`"/2024/dec/photo.jpg"`**
   - File at `public/photos/beach.png` → use **`"/photos/beach.png"`**

   Format: **`"/foldername/imagename.imagetype"** (no `public` in the path).

**Example memory in `src/data/memories.ts`:**

```ts
{
  id: 1,
  date: "2024-06-15",
  title: "Beach day",
  intro: "Our first trip to the coast together.",
  images: ["/2024/june/beach-1.jpg", "/2024/june/beach-2.jpg"],
  caption: "Summer 2024",
},
```

Add or edit entries in the `memories` array to change the book’s pages. Order in the array = order of pages in the book.

---

## Run locally

```sh
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`).

---

## Summary

| What you want to change | File to edit |
|-------------------------|--------------|
| All site text, names, links, book copy | `src/data/data.ts` |
| Book pages (memories), dates, titles, intros, images | `src/data/memories.ts` |
| Image files | Add under `/public` and use paths like `"/foldername/imagename.jpg"` |

---

## License

**Personal use** — Free. Use and modify for your own personal, non-commercial projects.

**Commercial use** — Requires a license. Contact **sauravpandey0325@gmail.com** to request one.

See [LICENSE](LICENSE) for full terms.
