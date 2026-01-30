---
name: shadcn-baseui
description: UI component guide using @base-ui/react and Tailwind CSS v4. Use when creating or modifying UI components in src/components/ui/. Triggers: "shadcn", "base-ui", "tailwind v4", "cva", "cn utility", "data-slot".
---

# UI Component Guidelines

## Core Principles

- **Base UI Primitives**: Use `@base-ui/react` for accessible, unstyled component primitives (NOT Radix UI).
- **Tailwind CSS v4**: Use Tailwind CSS v4 for styling, leveraging the latest engine features.
- **CVA for Variants**: Use `class-variance-authority` (CVA) to manage component variants and sizes.
- **Composition**: Follow shadcn/ui patterns for component composition and customization.

## Component Structure

Components are located in `src/components/ui/`.

- **Example (Button)**: `src/components/ui/button.tsx`
- **Variants**: Defined using `cva` (e.g., `buttonVariants` at `src/components/ui/button.tsx:6`).
- **Data Slots**: Use `data-slot` attributes for styling child elements or identifying component parts (e.g., `data-slot="button"` at `src/components/ui/button.tsx:44`).

## Utilities

- **cn**: Use the `cn` utility (from `src/core/shared/cn.ts` or `src/lib/utils/index.ts`) for merging Tailwind classes and handling conditional styles.

## Best Practices

- **Accessibility**: Ensure all components meet accessibility standards by using Base UI primitives correctly.
- **Responsive Design**: Use Tailwind's responsive prefixes (e.g., `sm:`, `md:`, `lg:`) for adaptive layouts.
- **Dark Mode**: Use the `dark:` prefix for dark mode specific styles.
- **Consistency**: Maintain consistent spacing, typography, and color usage across all components.
