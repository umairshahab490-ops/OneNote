import { SECTION_COLORS, editedExact, editedLabel, pageTitle, previewLine, type SectionColor } from "@/lib/notes/model";
import { Highlight } from "@/lib/notes/markdown";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Keyboard, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNotes } from "./notes-context";
import { IconButton, Mark, RenameField } from "./ui";

const COLOR_LABEL: Record<SectionColor, string> = {
  plum: "Plum",
  slate: "Slate",
  sage: "Sage",
  clay: "Clay",
  ink: "Ink",
};

export function PageSidebar() {
  const api = useNotes();
  const { doc } = api;
  const notebook = doc.notebooks.find((item) => item.id === doc.activeNotebookId) ?? doc.notebooks[0];
  const sections = doc.sections.filter((section) => section.notebookId === notebook?.id);
  const activeSection = sections.find((section) => section.id === doc.activeSectionId) ?? null;
  const searching = api.query.trim().length > 0;
  const pages = api.visiblePages;

  useEffect(() => {
    if (!doc.activePageId) return;
    document.getElementById(`page-${doc.activePageId}`)?.scrollIntoView({ block: "nearest" });
  }, [doc.activePageId, searching]);

  if (api.chromeHidden || !notebook) return null;

  return (
    <aside className={api.mobilePane === "editor" ? "page-sidebar is-hidden-mobile" : "page-sidebar"}>
      <div className="sidebar-brand md-only-hidden">
        <Mark />
        <span>OneNote</span>
      </div>

      <div className="sidebar-head">
        {api.renaming?.kind === "notebook" && api.renaming.id === notebook.id ? (
          <RenameField
            initial={notebook.name}
            label="Notebook name"
            className="rename-wide"
            onCommit={(name) => {
              api.renameNotebook(notebook.id, name);
              api.setRenaming(null);
            }}
            onCancel={() => api.setRenaming(null)}
          />
        ) : (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="notebook-trigger press">
              <span className="truncate">{notebook.name}</span>
              <ChevronDown className="size-4 shrink-0" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="menu-content" align="start" sideOffset={6}>
                {doc.notebooks.map((item) => (
                  <DropdownMenu.Item
                    key={item.id}
                    className="menu-item"
                    onSelect={() => api.selectNotebook(item.id)}
                  >
                    <span className="dot" data-color={item.color} />
                    <span className="truncate">{item.name}</span>
                    {item.id === notebook.id ? <span className="menu-meta">Current</span> : null}
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="menu-sep" />
                <DropdownMenu.Item className="menu-item" onSelect={api.createNotebook}>
                  New notebook
                </DropdownMenu.Item>
                <DropdownMenu.Item className="menu-item" onSelect={() => api.setRenaming({ kind: "notebook", id: notebook.id })}>
                  Rename notebook
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="menu-item menu-danger"
                  disabled={doc.notebooks.length < 2}
                  onSelect={() => void api.deleteNotebook(notebook.id)}
                >
                  Delete notebook
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>

      <form
        className="search-form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const target = pages.find((page) => page.id === doc.activePageId) ?? pages[0];
          if (target) api.openPage(target.id);
        }}
      >
        <div className="search-field">
          <Search className="search-icon" aria-hidden="true" />
          <input
            ref={api.searchRef}
            value={api.query}
            onChange={(event) => api.setQuery(event.target.value)}
            className="search-input"
            placeholder="Search pages"
            aria-label="Search pages"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <kbd className="search-kbd">{api.modLabel}+K</kbd>
        </div>
      </form>

      <div className="section-row" role="tablist" aria-label="Sections">
        {sections.map((section) => {
          const active = section.id === doc.activeSectionId && !searching;
          const renaming = api.renaming?.kind === "section" && api.renaming.id === section.id;
          if (renaming) {
            return (
              <RenameField
                key={section.id}
                initial={section.name}
                label="Section name"
                className="section-rename"
                onCommit={(name) => {
                  api.renameSection(section.id, name);
                  api.setRenaming(null);
                }}
                onCancel={() => api.setRenaming(null)}
              />
            );
          }
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              id={`section-${section.id}`}
              className="section-tab press"
              data-color={section.color}
              data-active={active ? "true" : "false"}
              aria-selected={active}
              onClick={() => api.selectSection(section.id)}
            >
              {section.name}
            </button>
          );
        })}
        <IconButton label="New section" onClick={api.createSection}>
          <Plus className="size-4" />
        </IconButton>
        {activeSection ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="icon-btn press" aria-label="Section actions" title="Section actions">
              <MoreHorizontal className="size-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="menu-content" align="end" sideOffset={6}>
                <DropdownMenu.Item
                  className="menu-item"
                  onSelect={() => api.setRenaming({ kind: "section", id: activeSection.id })}
                >
                  Rename section
                </DropdownMenu.Item>
                <div className="swatch-row" role="group" aria-label="Section color">
                  {SECTION_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="swatch"
                      data-color={color}
                      aria-label={COLOR_LABEL[color]}
                      aria-pressed={activeSection.color === color}
                      onClick={() => api.recolorSection(activeSection.id, color)}
                    />
                  ))}
                </div>
                <DropdownMenu.Separator className="menu-sep" />
                <DropdownMenu.Item className="menu-item menu-danger" onSelect={() => void api.deleteSection(activeSection.id)}>
                  Delete section
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : null}
      </div>

      <div className="list-head">
        <div>
          <h2>{searching ? "Results" : "Pages"}</h2>
          <p className="list-count" aria-live="polite">
            {pages.length} {pages.length === 1 ? "page" : "pages"}
            {searching ? (
              <button type="button" className="text-link" aria-pressed={api.searchAll} onClick={() => api.setSearchAll(!api.searchAll)}>
                {api.searchAll ? "All notebooks" : "This notebook"}
              </button>
            ) : null}
          </p>
        </div>
        <button type="button" className="text-action press" onClick={api.createPage} disabled={sections.length === 0}>
          <Plus className="size-4" />
          New page
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="empty-block">
          <p className="empty-title">No sections yet</p>
          <p className="empty-copy">A section holds the pages in this notebook.</p>
          <button type="button" className="btn btn-accent" onClick={api.createSection}>
            New section
          </button>
        </div>
      ) : pages.length === 0 ? (
        <div className="empty-block">
          <p className="empty-title">{searching ? "No matches" : "No pages yet"}</p>
          <p className="empty-copy">
            {searching
              ? `Nothing ${api.searchAll ? "in your notebooks" : `in ${notebook.name}`} contains “${api.query.trim()}”.`
              : "Create a page in this section and start writing."}
          </p>
          {!searching ? (
            <button type="button" className="btn btn-accent" onClick={api.createPage}>
              New page
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="page-list scroll-area" aria-label={searching ? "Search results" : "Pages"}>
          {pages.map((page, index) => {
            const active = page.id === doc.activePageId;
            const section = doc.sections.find((item) => item.id === page.sectionId);
            const owner = section ? doc.notebooks.find((item) => item.id === section.notebookId) : undefined;
            const title = pageTitle(page);
            const line = searching ? previewLine(page.body, api.query) : previewLine(page.body);
            const inList = pages.some((item) => item.id === doc.activePageId);
            return (
              <li key={page.id} className={active ? "page-row page-row-active" : "page-row"}>
                <button
                  type="button"
                  id={`page-${page.id}`}
                  data-page-select=""
                  className="page-select"
                  aria-current={active ? "page" : undefined}
                  tabIndex={active || (!inList && index === 0) ? 0 : -1}
                  onClick={() => api.openPage(page.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? pages[0]
                          : event.key === "End"
                            ? pages[pages.length - 1]
                            : pages[index + (event.key === "ArrowDown" ? 1 : -1)];
                      if (!next || next.id === page.id) return;
                      api.selectPage(next.id);
                      api.focusPageButton(next.id);
                      return;
                    }
                    if (event.key === "Enter") {
                      event.preventDefault();
                      api.openPage(page.id);
                      return;
                    }
                    if (event.key === "Delete" || event.key === "Backspace") {
                      event.preventDefault();
                      void api.deletePage(page.id);
                    }
                  }}
                >
                  <span className="page-name">
                    <Highlight text={title} query={api.query} />
                  </span>
                  {searching && section ? (
                    <span className="page-where">
                      <span className="dot" data-color={section.color} />
                      {section.name}
                      {api.searchAll && owner ? ` · ${owner.name}` : ""}
                    </span>
                  ) : null}
                  {line ? (
                    <span className="page-snippet">
                      <Highlight text={line} query={searching ? api.query : ""} />
                    </span>
                  ) : (
                    <span className="page-snippet">Empty page</span>
                  )}
                  <time dateTime={new Date(page.updatedAt).toISOString()} title={editedExact(page.updatedAt)}>
                    {editedLabel(page.updatedAt)}
                  </time>
                </button>
                <button
                  type="button"
                  className="page-delete press"
                  aria-label={`Delete ${title}`}
                  onClick={() => void api.deletePage(page.id)}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="shortcut-btn press" onClick={() => api.setHelpOpen(true)}>
        <Keyboard className="size-4" />
        Keyboard shortcuts
      </button>
    </aside>
  );
}
