import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/participante")({
  beforeLoad: () => {
    throw redirect({ to: "/", search: { dia: 1 } });
  },
});
