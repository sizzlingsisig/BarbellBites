# BarbellBites Design Notes

This document describes the current visual direction and where design tokens live in code.

## Visual Direction

- Dark, high-contrast interface
- Teal accent system for actions and highlights
- Glassmorphism overlays and soft glow backgrounds
- Dense but readable card-based content layout

## Token Sources

- Colors: `src/resources/colors.ts`
- Shadows: `src/resources/shadows.ts`
- Typography: `src/resources/typography.ts`
- Theme setup: `src/theme.ts`
- Global styles: `src/index.css`

## Core Palette (Reference)

- Near black: `#010202`
- Deep surface: `#0A0F0D`
- Card slate: `#0D1A15`
- Primary teal: `#079D84`
- Glow teal: `#00C896`
- Highlight mint: `#1DDFBD`
- Primary text: `#FAFBFB`
- Secondary text: `#A9B0AF`

## UI Patterns

- Cards use translucent backgrounds with subtle borders and inner highlights.
- Action controls favor high-contrast labels and clear hover/active states.
- Recipe content prioritizes hierarchy:
	- title and metadata
	- nutrition summary
	- ingredients/steps

## Responsive Guidance

- Mobile first layouts with stacked cards and reduced horizontal density.
- Desktop layouts increase spacing and leverage side-by-side sections.
- Keep tap targets and form controls comfortable on touch devices.

## Accessibility Guidance

- Maintain strong text/background contrast, especially on glass surfaces.
- Ensure keyboard focus visibility on all interactive elements.
- Avoid color-only state indicators for critical actions.