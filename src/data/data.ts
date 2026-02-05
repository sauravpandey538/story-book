/**
 * Centralized copy for the app: footer, header, hero, book (covers, dedication, etc.),
 * section descriptions, and accessibility labels. Import from here to keep text in one place.
 *
 * For index.html <title> and meta tags, use the same values from `site` (title, description, etc.)
 * so the app and HTML stay in sync.
 */

/** Placeholder names — replace with real names when deploying your own story */
const PARTNER_ONE = "Alex";
const PARTNER_TWO = "Jordan";

/** Site-wide metadata (title, meta description, OG, etc.) — keep in sync with index.html */
export const site = {
  title: "Our First Year | A Love Written in Time",
  description:
    "A digital memory book. An interactive story of our first year together, with photos and moments.",
  descriptionShort: "An interactive memory book of our love story.",
  author: "With Love",
  themeColor: "#f5f0eb",
} as const;

/** Header branding and nav */
export const header = {
  /** Names shown in logo with heart between */
  nameLeft: PARTNER_ONE,
  nameRight: PARTNER_TWO,
  /** CTA to scroll to book section */
  navCta: "Our Story",
  /** Optional: GitHub repo or profile URL — shown as icon next to Our Story. Leave empty to hide. */
  githubUrl: "https://github.com/sauravpandey538/story-book",
  /** Optional: LinkedIn profile URL — shown as icon next to Our Story. Leave empty to hide. */
  linkedinUrl: "https://www.linkedin.com/in/saurav-pandey-b3648530a/",
} as const;

/** Hero section above the book */
export const hero = {
  /** Subtitle line (with heart) */
  subtitle: `${PARTNER_ONE} & ${PARTNER_TWO} | Always & Forever`,
  /** Main headline */
  headline: "A Story Written by Fate",
  /** Quote under headline */
  quote:
    "Loving you feels like coming home to a place I never knew I was missing.",
  quoteAttribution: PARTNER_ONE,
  /** Primary CTA button */
  ctaButton: "Open Our Memories",
  /** Names repeated below divider */
  names: `${PARTNER_ONE} & ${PARTNER_TWO}`,
  /** Short line under names */
  tagline: "The love that began one winter morning.",
} as const;

/** Footer lines */
export const footer = {
  /** Top line with heart (same as hero subtitle) */
  branding: `${PARTNER_ONE} & ${PARTNER_TWO} | Always & Forever`,
  /** Copyright line; use with current year */
  copyright: "Memories of our first year together",
  /** Bottom credit */
  madeBy: `Made with ❤️ by ${PARTNER_ONE}`,
} as const;

/** Book: front cover, back cover, spine, dedication, closing, hints */
export const book = {
  /** Front cover title */
  coverTitle: "Our First Year",
  /** Front cover subtitle */
  coverSubtitle: "A Love Written in Time",
  /** Hint on closed cover */
  coverHint: "Click to open",
  /** Inside front cover (endpaper) quote */
  insideCoverQuote: "Every love story is beautiful, but ours is my favorite.",
  /** Back cover: same title as front */
  backCoverTitle: "Our First Year",
  /** Back cover subtitle */
  backCoverSubtitle: "A Love Written in Time",
  /** Back cover closing line */
  backCoverEnd: "The End",
  /** Spine text (vertical) */
  spineTitle: "OUR MEMORIES",
  /** Dedication page: main text (replace with your own) */
  dedication:
    "To you, with all my love. Every moment with you feels like a gift. May this book hold our dearest memories, and may our story grow with each page we turn together. Forever yours.",
  dedicationSignature: `— ${PARTNER_ONE}`,
  /** Closing spread (before back cover) */
  closingLine1: "I love you so much !!",
  closingLine2: "Forever yours.",
  /** Back endpaper (last left page before back cover) — e.g. Valentine ask */
  backEndpaperIntro:
    "This is only our first chapter. I want to fill so many more pages with you.",
  backEndpaperQuestion: "Will you be my valentine for 2026?",
  backEndpaperClosing: "I'm hoping for a yes ♥",
  /** Prompt when book is closed to reopen */
  reopenCta: "Read again from the beginning",
} as const;

/** Our Story section (heading and descriptions) */
export const ourStory = {
  /** Section heading */
  heading: "Our Memories",
  /** Blessing/wish line under heading (replace with your own) */
  blessing: "✨ May our love grow stronger. May we always walk together. ✨",
  /** Instruction under the book */
  instruction:
    "Turn the pages or use the arrows to relive our memories together.",
} as const;

/** Accessibility / aria-labels and fallback text */
export const a11y = {
  previousPage: "Previous page",
  nextPage: "Next page",
  viewImageFullSize: "View image full size",
  close: "Close",
  /** Fallback when image fails to load */
  photoFallback: "Photo",
  muteSound: "Mute page flip sound",
  unmuteSound: "Unmute page flip sound",
} as const;
