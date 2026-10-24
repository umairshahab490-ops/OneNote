import { NotesApp } from "@/components/notes/notes-app";
import { NotesProvider } from "@/components/notes/notes-context";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return (
      <main className="boot">
        <p>Opening notebook…</p>
      </main>
    );
  }
  return (
    <NotesProvider>
      <NotesApp />
    </NotesProvider>
  );
}
