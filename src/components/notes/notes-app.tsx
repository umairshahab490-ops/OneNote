import { EditorPane } from "./editor-pane";
import { HelpDialog } from "./help-dialog";
import { NotebookRail } from "./notebook-rail";
import { useNotes } from "./notes-context";
import { PageSidebar } from "./page-sidebar";

export function NotesApp() {
  const api = useNotes();
  return (
    <div className="desk">
      <div className="desk-columns">
        <NotebookRail />
        <PageSidebar />
        <EditorPane />
      </div>
      {api.undo ? (
        <div className="undo-bar" role="status">
          <span>{api.undo.label}</span>
          <button type="button" className="btn btn-accent" onClick={api.performUndo}>
            Undo
          </button>
          <button type="button" className="btn btn-quiet" onClick={api.dismissUndo}>
            Dismiss
          </button>
        </div>
      ) : null}
      <HelpDialog />
    </div>
  );
}
