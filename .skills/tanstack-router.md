---
name: tanstack-router
description: TanStack Router guide for file-based routing and state management. Use when adding routes, managing navigation, or using route context. Triggers: "tanstack router", "file-based routing", "beforeLoad", "createFileRoute", "route context".
---

# TanStack Router Guidelines

## Core Principles

- **File-Based Routing**: Routes are defined in `src/routes/`. The file structure determines the URL path.
- **Type-Safe Routing**: Use `createFileRoute` for all routes to ensure end-to-end type safety for params, search queries, and context.
- **Data Prefetching**: Use `beforeLoad` for data prefetching and route guards. Avoid using `loader` if `beforeLoad` can handle the requirement.

## Root Route and Context

The root route is defined in `src/routes/__root.tsx`. It sets up the global context for the application.

- **Context Definition**: `src/routes/__root.tsx:13`
- **Global State**: Includes `queryClient`, `user`, `session`, and `theme`.
- **Session Fetching**: The `beforeLoad` hook in `src/routes/__root.tsx:41` fetches the current session using `orpcClient.auth.maybeMe()`.

## Creating Routes

- **New Routes**: Create a new `.tsx` file in `src/routes/`.
- **Route Definition**:

  ```typescript
  import { createFileRoute } from "@tanstack/react-router";

  export const Route = createFileRoute("/my-route")({
    component: MyComponent,
  });
  ```

## Best Practices

- **Route Guards**: Implement authentication checks in `beforeLoad`.
- **Search Params**: Use Zod to validate and type search parameters.
- **Navigation**: Use the `Link` component or `useNavigate` hook for type-safe navigation.
- **Layouts**: Use `Outlet` to render child routes within a layout.
