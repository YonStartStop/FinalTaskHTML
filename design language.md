# Design Language

A coding-assistant reference for colors, typography, and component styles extracted from the Minecraft-themed team presentation Figma file.

---

## Colors

### Backgrounds
| Token | Hex |
|---|---|
| Background Primary | `#F0F0F0` |
| Background Secondary | `#FFFFFF` |

### Text
| Token | Hex |
|---|---|
| Text Primary | `#000000` |
| Text Secondary | `#545454` |
| Text Tertiary | `#767676` |

### Highlights / Accents
| Token | Hex |
|---|---|
| Highlight Blue | `#4687E2` |
| Highlight Indigo | `#B369E4` |
| Highlight Yellow | `#D2C517` |

---

## Component Styles

### Card
- **Border radius:** 6px
- **Border:** 3px, highlight color, trailing edge only (right side)
- **Shadow:** `#000` 20%, 1px down, 2px blur, 0px sideways

### Kid Bubble (speech bubble, child context)
- **Background:** `#FFFFFF`
- **Shadow:** `#000` 40%, 5px down, 8px blur

### Adult Bubble (speech bubble, adult context)
- **Background:** `#FFFFFF`
- **Shadow:** `#000` 30%, 3px down, 5px blur

---

## Typography

Two typeface families are used, segmented by narrative context.

### Narration (system/UI voice)
**Typeface:** Open Sans Hebrew

| Role | Size | Weight |
|---|---|---|
| H1 | 42px | Regular |
| H2 | 29px | **Bold** |
| H3 | 21px | **Bold** |
| Body | 18px | Regular |
| Quote | 20px | Regular |
| Caption | 14px | Regular |

### Kid (child character voice)
**Typeface:** Playpen Sans Hebrew

| Role | Size | Weight |
|---|---|---|
| Body | 20px | Medium |
| Body (emphasis) | 20px | **Bold** |

### Adult (adult character voice)
**Typeface:** Open Sans Hebrew Condensed

| Role | Size | Weight |
|---|---|---|
| Regular | 23px | Regular |

---

## Usage Notes

- Cards use the **highlight color** (Blue, Indigo, or Yellow) as the right-side border accent — use this to visually categorize card content by type or team member.
- **Kid** content uses Playpen Sans Hebrew to give a handwritten, approachable feel; **Adult** content uses the condensed variant of Open Sans Hebrew to feel more matter-of-fact.
- Bubble shadow intensity distinguishes speakers: Kid bubbles cast a stronger shadow (40%, 8px blur) vs. Adult bubbles (30%, 5px blur).
