# Barbell Bites Design System

## Color Palette

### Neutrals (Background + UI)
| Color | Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| <div style="background-color: #010202; width: 24px; height: 24px; border-radius: 4px; border: 1px solid #49514A;"></div> | **near-black** | `#010202` | Main application background (base of gradient). |
| <div style="background-color: #0a0f0d; width: 24px; height: 24px; border-radius: 4px;"></div> | **deep-surface** | `#0A0F0D` | Gradient start — richest dark, hero image overlay base. |
| <div style="background-color: #0d1a15; width: 24px; height: 24px; border-radius: 4px;"></div> | **card-slate** | `#0D1A15` | Gradient mid — glass card base tint, background depth layer. |
| <div style="background-color: #091210; width: 24px; height: 24px; border-radius: 4px;"></div> | **border-slate** | `#091210` | Gradient end — deepest green-black, section separators. |
| <div style="background-color: #49514A; width: 24px; height: 24px; border-radius: 4px;"></div> | **text-slate** | `#49514A` | Muted text, disabled states, placeholders. |
| <div style="background-color: #A9B0AF; width: 24px; height: 24px; border-radius: 4px;"></div> | **chrome-gray** | `#A9B0AF` | Secondary text, icons, subheadings. |
| <div style="background-color: #FAFBFB; width: 24px; height: 24px; border-radius: 4px; border: 1px solid #ccc;"></div> | **white-ui** | `#FAFBFB` | Primary text, high-emphasis UI elements. |

### Glass Surface Tokens
| Color | Name | Value | Usage |
| :--- | :--- | :--- | :--- |
| <div style="background-color: rgba(255,255,255,0.04); width: 24px; height: 24px; border-radius: 4px; border: 1px solid #ccc;"></div> | **glass-fill-subtle** | `rgba(255,255,255,0.04)` | Form card glass background — lightest frost layer. |
| <div style="background-color: rgba(255,255,255,0.05); width: 24px; height: 24px; border-radius: 4px; border: 1px solid #ccc;"></div> | **glass-fill-base** | `rgba(255,255,255,0.05)` | Hero content card glass background — standard frost. |
| <div style="background-color: rgba(255,255,255,0.08); width: 24px; height: 24px; border-radius: 4px; border: 1px solid #ccc;"></div> | **glass-border** | `rgba(255,255,255,0.08)` | Glass panel borders — form card edge. |
| <div style="background-color: rgba(255,255,255,0.10); width: 24px; height: 24px; border-radius: 4px; border: 1px solid #ccc;"></div> | **glass-border-raised** | `rgba(255,255,255,0.10)` | Hero card border — slightly more visible on darker bg. |
| <div style="background-color: rgba(255,255,255,0.06); width: 24px; height: 24px; border-radius: 4px; border: 1px solid #ccc;"></div> | **glass-inner-highlight** | `rgba(255,255,255,0.06)` | Inset top-edge shine on glass cards (`inset 0 1px 0`). |

### Accents (Teal Glow)
| Color | Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| <div style="background-color: #0C373B; width: 24px; height: 24px; border-radius: 4px;"></div> | **deep-teal** | `#0C373B` | Subtle tinted backgrounds, active states for dark surfaces. |
| <div style="background-color: #115553; width: 24px; height: 24px; border-radius: 4px;"></div> | **dark-teal** | `#115553` | Hover states for primary buttons, heavy accents. |
| <div style="background-color: #079D84; width: 24px; height: 24px; border-radius: 4px;"></div> | **primary-teal** | `#079D84` | Primary brand color, main buttons, active tabs. |
| <div style="background-color: #00c896; width: 24px; height: 24px; border-radius: 4px;"></div> | **glow-teal** | `#00C896` | Ambient orbs, hero heading accent, stat pill text & borders. |
| <div style="background-color: #1DDFBD; width: 24px; height: 24px; border-radius: 4px;"></div> | **neon-highlight** | `#1DDFBD` | Extreme highlights, glowing accents, success text. |

### Glow & Ambient Tokens
| Token | Value | Usage |
| :--- | :--- | :--- |
| **orb-top-left** | `radial-gradient(circle, #00c896 0%, transparent 70%)` at 20% opacity | Top-left background depth orb. |
| **orb-right** | `radial-gradient(circle, #00b37d 0%, transparent 70%)` at 15% opacity | Right-side background depth orb. |
| **orb-bottom** | `radial-gradient(circle, #00ffa3 0%, transparent 70%)` at 10% opacity | Bottom ambient fill orb. |
| **hero-floor-glow** | `radial-gradient(ellipse at 30% 100%, #00c896, transparent 70%)` at 20% opacity | Upward teal bloom inside hero panel. |
| **card-accent-line** | `linear-gradient(90deg, transparent, rgba(0,200,150,0.5), transparent)` | 1px top-edge teal shimmer on hero glass card. |

### Shadow Tokens
| Token | Value | Usage |
| :--- | :--- | :--- |
| **shadow-glass-form** | `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)` | Form card drop + inner highlight. |
| **shadow-glass-hero** | `0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)` | Hero card — deeper, more dramatic. |

### Backdrop Blur Scale
| Token | Value | Usage |
| :--- | :--- | :--- |
| **blur-image-overlay** | `blur(2px)` | Hero image softening overlay. |
| **blur-glass-form** | `blur(24px) saturate(180%)` | Form card backdrop glass effect. |
| **blur-glass-hero** | `blur(32px) saturate(200%)` | Hero card — stronger glass, more depth. |
| **blur-stat-pill** | `blur(8px)` | Teal stat badge pill frosting. |