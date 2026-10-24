import { Plus } from "lucide-react";
import { Mark } from "./ui";
import { useNotes } from "./notes-context";

export function NotebookRail() {
  const { doc, chromeHidden, selectNotebook, createNotebook } = useNotes();
  if (chromeHidden) return null;

  return (
    <nav className="notebook-rail" aria-label="Notebooks">
      <Mark className="rail-mark" />
      <div className="rail-list">
        {doc.notebooks.map((notebook) => {
          const active = notebook.id === doc.activeNotebookId;
          const letter = notebook.name.trim().charAt(0).toUpperCase() || "N";
          return (
            <button
              key={notebook.id}
              type="button"
              className="rail-btn press"
              aria-label={notebook.name}
              title={notebook.name}
              aria-current={active ? "true" : undefined}
              onClick={() => selectNotebook(notebook.id)}
            >
              <span className="notebook-cover" data-color={notebook.color} data-active={active ? "true" : "false"}>
                {letter}
              </span>
            </button>
          );
        })}
      </div>
      <button type="button" className="rail-btn press rail-add" onClick={createNotebook} aria-label="New notebook" title="New notebook">
        <Plus className="size-5" />
      </button>
    </nav>
  );
}
