# Design Language

A coding-assistant reference for colors, typography, component styles, and layout behavior for the "אמא, למה?" web app.

---

## Colors

### Backgrounds
| Token | Hex | Notes |
|---|---|---|
| Background Primary | `#F4FCFF` | Very light blue, used for page body |

### Text
| Token | Hex |
|---|---|
| Text Primary | `#000000` |
| Text Secondary | `#545454` |
| Text Tertiary | `#767676` |

### Navigation
| Token | Hex | Notes |
|---|---|---|
| Nav Background | `#402A4F` | Deep purple |
| Nav Text | `#FFFFFF` | Default nav link color |
| Nav Text Selected | `#00FFFF` | Cyan highlight for active nav item |

### Bubble Components
| Token | Hex | Notes |
|---|---|---|
| Kid Bubble | `#D0DDFB` | Soft periwinkle-blue |
| Adult Bubble | `#FFEBF5` | Soft blush-pink |

### Background Decorative Elements
Large abstract blob shapes sit behind content in the hero/bubble-field area. They are light pastels — not white and not saturated — meant to feel airy and organic:
- **Pastel red / coral:** a large soft salmon-pink blob, positioned lower-left, partially cropped
- **Pastel green:** a tall, narrow rounded ellipse, positioned center-right

These shapes should have no stroke, no shadow, and ~20–30% opacity or a very desaturated fill so they don't compete with bubble text.

---

## Component Styles

### Navigation Bar
- **Background:** `#402A4F` (deep purple)
- **Text:** `#FFFFFF`, selected state `#00FFFF`
- **Shape:** The navbar does not have a flat bottom edge — it has a **wavy, organic bottom border** that curves gently downward into the page content. The wave is smooth and continuous, not jagged. Implement as an SVG `<path>` or `clip-path` on the nav container, or as an absolutely-positioned SVG wave element overlapping the top of the page content below.
- The logo / app name sits on the **right side** of the nav (RTL layout), with nav links spreading left from it.

### Kid Bubble (speech bubble, child voice)
- **Background:** `#D0DDFB`
- **Shadow:** `#000` 40% opacity, 5px down, 8px blur, 0px spread
- Tail points toward the bottom-right (child speaking)

### Adult Bubble (speech bubble, adult/parent voice)
- **Background:** `#FFEBF5`
- **Shadow:** `#000` 30% opacity, 3px down, 5px blur, 0px spread
- Tail points toward the bottom-right

---

## Typography

### Narration (UI voice, headings, body copy)
**Typeface:** Rubik

| Role | Size | Weight |
|---|---|---|
| H1 | 42px | Black (900) |
| H2 | 29px | **Bold** |
| H3 | 21px | **Bold** |
| Body | 18px | Regular |
| Quote | 20px | Regular |
| Caption | 14px | Regular |

> Note: H1 uses Rubik Black — the heaviest weight — to give the main title strong presence. H2 and H3 use Bold.

### Kid (child character voice, question bubbles)
**Typeface:** Playpen Sans Hebrew

| Role | Size | Weight |
|---|---|---|
| Body | 20px | Medium |
| Body (emphasis) | 20px | **Bold** |

### Adult (parent/adult character voice)
**Typeface:** Open Sans Hebrew Condensed

| Role | Size | Weight |
|---|---|---|
| Regular | 23px | Regular |

---

## Layout & Scroll Behavior

### Hero / "Bubble Field" Section
The hero section is a full-viewport area filled with floating speech bubbles at various sizes, scattered across the space. There is no rigid grid — bubbles are organically placed, overlapping slightly, giving the feeling of a busy mind full of questions.

**First illustration:** A character illustration (girl with magnifying glass) is positioned in the lower-right of the hero frame, partially cropped by the viewport edge. It grounds the scene and should be visible on initial load without scrolling.

**Fold behavior:**
- The hero bubble-field fills approximately one full viewport height.
- The **top edge of the next section's navigation/heading** (the topic content section below the bubble field) should be **just barely visible above the fold** — only a sliver, perhaps 20–40px of the section header peeking up. This acts as a scroll invitation, hinting that content continues below without showing it fully.
- Do not let the next section's content fully appear without scrolling; the peek should feel intentional and subtle.

### RTL
The entire layout is **right-to-left (RTL)**. Set `dir="rtl"` on the root element. The logo and app name appear on the right; nav links flow leftward from it.

