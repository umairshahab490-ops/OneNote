import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useNotes } from "./notes-context";

export function HelpDialog() {
  const api = useNotes();
  const rows = [
    ["New page", `${api.altLabel}+N`],
    ["New section", `${api.altLabel}+Shift+N`],
    ["New notebook", `${api.altLabel}+Shift+B`],
    ["Search", `${api.modLabel}+K`],
    ["Edit, split, preview", `${api.modLabel}+\\`],
    ["Hide the sidebar", `${api.modLabel}+Shift+\\`],
    ["Next page", `${api.altLabel}+↓`],
    ["Previous page", `${api.altLabel}+↑`],
    ["Delete page", `${api.modLabel}+Shift+Backspace`],
    ["Bold / italic", `${api.modLabel}+B / ${api.modLabel}+I`],
    ["Close or go back", "Esc"],
    ["This list", "?"],
  ];

  return (
    <Dialog.Root open={api.helpOpen} onOpenChange={api.setHelpOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-head">
            <Dialog.Title className="dialog-title">Keyboard</Dialog.Title>
            <Dialog.Close className="icon-btn press" aria-label="Close shortcuts">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="dialog-copy">
            These work while you write. New page, search, and delete are also in the sidebar.
          </Dialog.Description>
          <ul className="shortcut-list">
            {rows.map(([label, keys]) => (
              <li key={label}>
                <span>{label}</span>
                <kbd>{keys}</kbd>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
