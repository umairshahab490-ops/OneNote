import {
  indentSelection,
  insertCode,
  insertLink,
  toggleLinePrefix,
  toggleTask,
  wrapSelection,
  type EditResult,
} from "@/lib/notes/editing";
import { MarkdownView } from "@/lib/notes/markdown";
import { editedExact, editedLabel, pageTitle, wordCount, type ViewMode } from "@/lib/notes/model";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Bold,
  ChevronLeft,
  Code,
  Columns2,
  Eye,
  Heading1,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  ListTodo,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  Quote,
  Strikethrough,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useNotes } from "./notes-context";
import { IconButton } from "./ui";

const VIEWS: { mode: ViewMode; label: string; icon: typeof PenLine }[] = [
  { mode: "edit", label: "Edit", icon: PenLine },
  { mode: "split", label: "Split", icon: Columns2 },
  { mode: "preview", label: "Preview", icon: Eye },
];

export function EditorPane() {
  const api = useNotes();
  const { doc } = api;
  const page = doc.pages.find((item) => item.id === doc.activePageId) ?? null;
  const section = doc.sections.find((item) => item.id === page?.sectionId);
  const notebook = doc.notebooks.find((item) => item.id === (section?.notebookId ?? doc.activeNotebookId));
  const sections = doc.sections.filter((item) => item.notebookId === notebook?.id);
  const titleRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const mode = api.effectiveView;
  const showEditor = mode !== "preview";
  const showPreview = mode === "preview" || (mode === "split" && api.wide);
  const hiddenOnMobile = api.mobilePane === "list" && !api.chromeHidden;

  useEffect(() => {
    if (api.focusTick === 0) return;
    titleRef.current?.focus();
  }, [api.focusTick]);

  const commit = (result: EditResult) => {
    if (!page) return;
    const el = areaRef.current;
    api.updatePage(page.id, { body: result.value });
    window.requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  const run = (edit: (value: string, start: number, end: number) => EditResult) => {
    const el = areaRef.current;
    if (!el || !page) return;
    commit(edit(el.value, el.selectionStart, el.selectionEnd));
  };

  const showPages = () => {
    api.setChromeHidden(false);
    api.setMobilePane("list");
  };

  return (
    <section className={hiddenOnMobile ? "editor-pane is-hidden-mobile" : "editor-pane"} aria-label="Page">
      <header className="editor-toolbar">
        <IconButton label="Pages" className="mobile-back" onClick={showPages}>
          <ChevronLeft className="size-5" />
        </IconButton>
        <div className="format-bar" role="toolbar" aria-label="Formatting">
          <IconButton label="Bold" disabled={!showEditor} onClick={() => run((v, s, e) => wrapSelection(v, s, e, "**", "**"))}>
            <Bold className="size-4" />
          </IconButton>
          <IconButton label="Italic" disabled={!showEditor} onClick={() => run((v, s, e) => wrapSelection(v, s, e, "*", "*"))}>
            <Italic className="size-4" />
          </IconButton>
          <IconButton label="Strikethrough" disabled={!showEditor} onClick={() => run((v, s, e) => wrapSelection(v, s, e, "~~", "~~"))}>
            <Strikethrough className="size-4" />
          </IconButton>
          <span className="tool-sep" />
          <IconButton label="Heading" disabled={!showEditor} onClick={() => run((v, s, e) => toggleLinePrefix(v, s, e, "# "))}>
            <Heading1 className="size-4" />
          </IconButton>
          <IconButton label="Subheading" disabled={!showEditor} onClick={() => run((v, s, e) => toggleLinePrefix(v, s, e, "## "))}>
            <Heading2 className="size-4" />
          </IconButton>
          <IconButton label="Bulleted list" disabled={!showEditor} onClick={() => run((v, s, e) => toggleLinePrefix(v, s, e, "- "))}>
            <List className="size-4" />
          </IconButton>
          <IconButton label="Numbered list" disabled={!showEditor} onClick={() => run((v, s, e) => toggleLinePrefix(v, s, e, "1. "))}>
            <ListOrdered className="size-4" />
          </IconButton>
          <IconButton label="Task list" disabled={!showEditor} onClick={() => run((v, s, e) => toggleLinePrefix(v, s, e, "- [ ] "))}>
            <ListTodo className="size-4" />
          </IconButton>
          <span className="tool-sep" />
          <IconButton label="Quote" disabled={!showEditor} onClick={() => run((v, s, e) => toggleLinePrefix(v, s, e, "> "))}>
            <Quote className="size-4" />
          </IconButton>
          <IconButton label="Code" disabled={!showEditor} onClick={() => run(insertCode)}>
            <Code className="size-4" />
          </IconButton>
          <IconButton label="Link" disabled={!showEditor} onClick={() => run(insertLink)}>
            <Link className="size-4" />
          </IconButton>
        </div>
        <div className="toolbar-end">
          <div className="view-switch" role="radiogroup" aria-label="Editor view">
            {VIEWS.map((view) => {
              const Icon = view.icon;
              const checked = mode === view.mode || (view.mode === "edit" && mode === "split" && !api.wide);
              if (view.mode === "split") {
                return (
                  <button
                    key={view.mode}
                    type="button"
                    role="radio"
                    aria-checked={doc.viewMode === "split"}
                    aria-label={view.label}
                    title={view.label}
                    className="view-btn split-only press"
                    onClick={() => api.setView("split")}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              }
              return (
                <button
                  key={view.mode}
                  type="button"
                  role="radio"
                  aria-checked={view.mode === "preview" ? mode === "preview" : checked}
                  aria-label={view.label}
                  title={view.label}
                  className={checked && view.mode !== "preview" ? "view-btn press is-on" : mode === "preview" && view.mode === "preview" ? "view-btn press is-on" : "view-btn press"}
                  onClick={() => api.setView(view.mode)}
                >
                  <Icon className="size-4" />
                </button>
              );
            })}
          </div>
          <IconButton
            className="desktop-only"
            label={api.chromeHidden ? "Show pages" : "Hide sidebar"}
            onClick={() => api.setChromeHidden((hidden) => !hidden)}
          >
            {api.chromeHidden ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </IconButton>
          {page ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="icon-btn press" aria-label="Page actions" title="Page actions">
                <MoreHorizontal className="size-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="menu-content" align="end" sideOffset={6}>
                  <DropdownMenu.Item className="menu-item" onSelect={() => api.duplicatePage(page.id)}>
                    Duplicate page
                  </DropdownMenu.Item>
                  {sections
                    .filter((item) => item.id !== page.sectionId)
                    .map((item) => (
                      <DropdownMenu.Item
                        key={item.id}
                        className="menu-item"
                        onSelect={() => api.movePage(page.id, item.id)}
                      >
                        <span className="dot" data-color={item.color} />
                        Move to {item.name}
                      </DropdownMenu.Item>
                    ))}
                  <DropdownMenu.Separator className="menu-sep" />
                  <DropdownMenu.Item className="menu-item menu-danger" onSelect={() => void api.deletePage(page.id)}>
                    Delete page
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : null}
        </div>
      </header>

      {page && section && notebook ? (
        <div className="editor-body">
          <div className={mode === "split" && api.wide ? "paper paper-wide" : "paper"}>
            <p className="crumbs">
              <button type="button" onClick={showPages}>
                {notebook.name}
              </button>
              <span aria-hidden="true">/</span>
              <button type="button" onClick={showPages}>
                {section.name}
              </button>
            </p>
            <input
              ref={titleRef}
              key={`${page.id}-title`}
              className="page-title"
              value={page.title}
              aria-label="Page title"
              placeholder="Untitled page"
              onChange={(event) => api.updatePage(page.id, { title: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  areaRef.current?.focus();
                }
              }}
            />
            <p className="edited-line">
              <time dateTime={new Date(page.updatedAt).toISOString()} title={editedExact(page.updatedAt)}>
                Edited {editedLabel(page.updatedAt).toLowerCase() === "just now" ? "just now" : editedLabel(page.updatedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{api.saveError ? "Could not save on this device" : "Saved on this device"}</span>
            </p>
          </div>
          <div className={mode === "split" && api.wide ? "writing writing-split" : "writing"}>
            {showEditor ? (
              <textarea
                ref={areaRef}
                key={page.id}
                className="writing-field"
                value={page.body}
                aria-label="Page body"
                placeholder="Start writing in Markdown…"
                spellCheck
                onChange={(event) => api.updatePage(page.id, { body: event.target.value })}
                onKeyDown={(event) => {
                  const el = event.currentTarget;
                  const mod = event.metaKey || event.ctrlKey;
                  if (mod && event.key.toLowerCase() === "b") {
                    event.preventDefault();
                    commit(wrapSelection(el.value, el.selectionStart, el.selectionEnd, "**", "**"));
                    return;
                  }
                  if (mod && event.key.toLowerCase() === "i") {
                    event.preventDefault();
                    commit(wrapSelection(el.value, el.selectionStart, el.selectionEnd, "*", "*"));
                    return;
                  }
                  if (event.key === "Tab") {
                    event.preventDefault();
                    commit(indentSelection(el.value, el.selectionStart, el.selectionEnd, event.shiftKey));
                  }
                }}
              />
            ) : null}
            {showPreview ? (
              <div className={showEditor ? "preview-pane preview-split" : "preview-pane"}>
                <MarkdownView source={page.body} onToggleTask={(raw) => api.updatePage(page.id, { body: toggleTask(page.body, raw) })} />
              </div>
            ) : null}
          </div>
          <footer className="editor-foot">
            <span className="tabular">{wordCount(page.body)} words</span>
            <span>Markdown</span>
          </footer>
        </div>
      ) : (
        <div className="editor-empty">
          <p className="empty-title">No page open</p>
          <p className="empty-copy">
            {section ? `Add a page to ${section.name}.` : "Add a section, then a page, and start writing."}
          </p>
          <button type="button" className="btn btn-accent" onClick={section ? api.createPage : api.createSection}>
            {section ? "New page" : "New section"}
          </button>
        </div>
      )}
      {page ? <span className="sr-only">Editing {pageTitle(page)}</span> : null}
    </section>
  );
}
