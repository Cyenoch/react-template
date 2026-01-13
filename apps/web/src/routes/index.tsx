import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-svh grid place-items-center">
      <h1 className="text-2xl font-bold">Hello World</h1>
    </div>
  );
}
