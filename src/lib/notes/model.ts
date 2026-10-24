import { format, formatDistanceToNowStrict } from "date-fns";
import { z } from "zod";

export const SECTION_COLORS = ["plum", "slate", "sage", "clay", "ink"] as const;
export type SectionColor = (typeof SECTION_COLORS)[number];
export const VIEW_MODES = ["edit", "split", "preview"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

export type Notebook = {
  id: string;
  name: string;
  color: SectionColor;
  createdAt: number;
  updatedAt: number;
};

export type Section = {
  id: string;
  notebookId: string;
  name: string;
  color: SectionColor;
  createdAt: number;
  updatedAt: number;
};

export type Page = {
  id: string;
  sectionId: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type NotesState = {
  notebooks: Notebook[];
  sections: Section[];
  pages: Page[];
  activeNotebookId: string;
  activeSectionId: string;
  activePageId: string | null;
  viewMode: ViewMode;
};

export type UndoRecord =
  | {
      kind: "page";
      label: string;
      page: Page;
      activeNotebookId: string;
      activeSectionId: string;
      activePageId: string | null;
    }
  | {
      kind: "section";
      label: string;
      section: Section;
      pages: Page[];
      activeNotebookId: string;
      activeSectionId: string;
      activePageId: string | null;
    }
  | {
      kind: "notebook";
      label: string;
      notebook: Notebook;
      sections: Section[];
      pages: Page[];
      activeNotebookId: string;
      activeSectionId: string;
      activePageId: string | null;
    };

export type Action =
  | { type: "select-notebook"; id: string }
  | { type: "create-notebook"; id: string; sectionId: string; pageId: string }
  | { type: "rename-notebook"; id: string; name: string }
  | { type: "delete-notebook"; id: string }
  | { type: "select-section"; id: string }
  | { type: "create-section"; id: string; pageId: string }
  | { type: "rename-section"; id: string; name: string }
  | { type: "recolor-section"; id: string; color: SectionColor }
  | { type: "delete-section"; id: string }
  | { type: "select-page"; id: string }
  | { type: "create-page"; id: string }
  | { type: "update-page"; id: string; title?: string; body?: string }
  | { type: "delete-page"; id: string }
  | { type: "duplicate-page"; id: string; newId: string }
  | { type: "move-page"; id: string; sectionId: string }
  | { type: "set-view"; mode: ViewMode };

const STORAGE_KEY = "onenote-desk.v1";

const notebookSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.enum(SECTION_COLORS),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const sectionSchema = z.object({
  id: z.string(),
  notebookId: z.string(),
  name: z.string(),
  color: z.enum(SECTION_COLORS),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const pageSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const stateSchema = z.object({
  notebooks: z.array(notebookSchema).min(1),
  sections: z.array(sectionSchema),
  pages: z.array(pageSchema),
  activeNotebookId: z.string(),
  activeSectionId: z.string(),
  activePageId: z.string().nullable(),
  viewMode: z.enum(VIEW_MODES),
});

export function createSeed(now = Date.now()): NotesState {
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;
  const personal = "nb-personal";
  const work = "nb-work";
  const quick = "sec-quick";
  const meetings = "sec-meetings";
  const ideas = "sec-ideas";
  const projects = "sec-projects";

  return {
    notebooks: [
      { id: personal, name: "Personal", color: "plum", createdAt: now - 40 * day, updatedAt: now - 8 * min },
      { id: work, name: "Work", color: "slate", createdAt: now - 12 * day, updatedAt: now - 2 * day },
    ],
    sections: [
      { id: quick, notebookId: personal, name: "Quick Notes", color: "plum", createdAt: now - 40 * day, updatedAt: now - 8 * min },
      { id: meetings, notebookId: personal, name: "Meetings", color: "slate", createdAt: now - 20 * day, updatedAt: now - 3 * hour },
      { id: ideas, notebookId: personal, name: "Ideas", color: "sage", createdAt: now - 15 * day, updatedAt: now - 6 * hour },
      { id: projects, notebookId: work, name: "Projects", color: "clay", createdAt: now - 12 * day, updatedAt: now - 2 * day },
    ],
    pages: [
      {
        id: "page-welcome",
        sectionId: quick,
        title: "Welcome to your notebook",
        body: [
          "A desk for notebooks, sections, and pages. Everything you type stays in this browser.",
          "",
          "## Write",
          "",
          "Use the toolbar, or press **Ctrl+B** for bold and **Ctrl+I** for italic. Lists, tasks, quotes, and code all preview live.",
          "",
          "- Capture a thought before it slips",
          "- Break a project into pages",
          "- Keep meeting notes in their own section",
          "",
          "> Toggle Preview when you want the rendered page instead of the source.",
          "",
          "## Find anything",
          "",
          "Search is instant and looks through titles and page text. Switch to all notebooks when a note might live somewhere else.",
          "",
          "---",
          "",
          "Delete anything you do not need. This welcome page is only a starting point.",
        ].join("\n"),
        createdAt: now - 40 * day,
        updatedAt: now - 8 * min,
      },
      {
        id: "page-grocery",
        sectionId: quick,
        title: "Grocery run",
        body: ["## This week", "", "- [x] Oat milk", "- [ ] Lemons", "- [ ] Sourdough", "- [ ] Coffee beans", "", "## Already home", "", "- Eggs", "- Rice", "- Olive oil"].join("\n"),
        createdAt: now - 2 * day,
        updatedAt: now - 26 * hour,
      },
      {
        id: "page-reading",
        sectionId: quick,
        title: "Reading list",
        body: ["## On the desk", "", "1. A short history of paper", "2. Notes on attention", "3. The design of everyday tools", "", "Leave a line under a title when a book earns a second look."].join("\n"),
        createdAt: now - 9 * day,
        updatedAt: now - 4 * day,
      },
      {
        id: "page-weekly",
        sectionId: meetings,
        title: "Weekly review",
        body: [
          "## Agenda",
          "",
          "1. What moved forward",
          "2. What is stuck",
          "3. What to drop",
          "",
          "### Notes",
          "",
          "The launch checklist lives in the Work notebook. Keep decisions on the page they belong to.",
          "",
          "### Actions",
          "",
          "- [ ] Send the recap",
          "- [ ] Move the design notes into Ideas",
          "- [x] File last week's pages",
        ].join("\n"),
        createdAt: now - 6 * day,
        updatedAt: now - 3 * hour,
      },
      {
        id: "page-sketch",
        sectionId: ideas,
        title: "Quiet capture",
        body: [
          "## A page should open fast",
          "",
          "Take the words, then get out of the way.",
          "",
          "### Principles",
          "",
          "1. One notebook, many sections",
          "2. Search across pages instantly",
          "3. Markdown you can read, and a preview when you want it",
          "",
          "```",
          "open page",
          "write",
          "close the sidebar",
          "```",
        ].join("\n"),
        createdAt: now - 8 * day,
        updatedAt: now - 6 * hour,
      },
      {
        id: "page-launch",
        sectionId: projects,
        title: "Launch checklist",
        body: [
          "## Before we ship",
          "",
          "- [x] Name the sections",
          "- [ ] Write the empty states",
          "- [ ] Check the keyboard path",
          "- [ ] Read it on a phone",
          "",
          "Ship when the page still makes sense with the sidebar closed.",
        ].join("\n"),
        createdAt: now - 5 * day,
        updatedAt: now - 2 * day,
      },
    ],
    activeNotebookId: personal,
    activeSectionId: quick,
    activePageId: "page-welcome",
    viewMode: "split",
  };
}

export function pagesInSection(state: NotesState, sectionId: string): Page[] {
  return state.pages.filter((page) => page.sectionId === sectionId);
}

export function searchPages(state: NotesState, notebookId: string | "all", query: string): Page[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const allowed = new Set(
    notebookId === "all"
      ? state.sections.map((section) => section.id)
      : state.sections.filter((section) => section.notebookId === notebookId).map((section) => section.id),
  );
  return state.pages
    .filter((page) => {
      if (!allowed.has(page.sectionId)) return false;
      return page.title.toLowerCase().includes(needle) || page.body.toLowerCase().includes(needle);
    })
    .sort((a, b) => b.updatedAt - a.updatedAt || b.createdAt - a.createdAt);
}

export function previewLine(body: string, query = ""): string {
  const plain = body
    .replace(/```[\s\S]*?```/g, " ")
    .split("\n")
    .map((line) => line.replace(/^\s{0,3}(#{1,6}\s+|>\s+|[-*+]\s+|\d+\.\s+|\[[ xX]\]\s+)/, "").replace(/[*_`~]/g, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const needle = query.trim().toLowerCase();
  if (!needle) return plain.slice(0, 110);
  const at = plain.toLowerCase().indexOf(needle);
  if (at < 0) return plain.slice(0, 110);
  const start = Math.max(0, at - 36);
  const slice = plain.slice(start, start + 110);
  return (start > 0 ? "…" : "") + slice;
}

export function pageTitle(page: Page): string {
  return page.title.trim() || "Untitled page";
}

export function wordCount(body: string): number {
  const text = body.trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

export function editedLabel(ts: number, now = Date.now()): string {
  const delta = now - ts;
  if (delta < 45_000) return "Just now";
  if (delta < 7 * 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(new Date(ts), { addSuffix: true });
  }
  return format(new Date(ts), "MMM d, yyyy");
}

export function editedExact(ts: number): string {
  return format(new Date(ts), "MMM d, yyyy 'at' h:mm a");
}

export function repair(state: NotesState): NotesState {
  const notebooks = state.notebooks.filter((notebook) => notebook.name.trim());
  if (notebooks.length === 0) return createSeed();
  const notebookIds = new Set(notebooks.map((notebook) => notebook.id));
  const sections = state.sections.filter((section) => notebookIds.has(section.notebookId) && section.name.trim());
  const sectionIds = new Set(sections.map((section) => section.id));
  const pages = state.pages.filter((page) => sectionIds.has(page.sectionId));
  const activeNotebookId = notebookIds.has(state.activeNotebookId) ? state.activeNotebookId : notebooks[0].id;
  const inNotebook = sections.filter((section) => section.notebookId === activeNotebookId);
  const activeSectionId = inNotebook.some((section) => section.id === state.activeSectionId)
    ? state.activeSectionId
    : (inNotebook[0]?.id ?? "");
  const inSection = pages.filter((page) => page.sectionId === activeSectionId);
  const activePageId = inSection.some((page) => page.id === state.activePageId)
    ? state.activePageId
    : (inSection[0]?.id ?? null);
  const viewMode = VIEW_MODES.includes(state.viewMode) ? state.viewMode : "edit";
  return { notebooks, sections, pages, activeNotebookId, activeSectionId, activePageId, viewMode };
}

function stamp() {
  return Date.now();
}

export function apply(state: NotesState, action: Action): { state: NotesState; undo: UndoRecord | null } {
  switch (action.type) {
    case "select-notebook": {
      if (!state.notebooks.some((notebook) => notebook.id === action.id)) return { state, undo: null };
      const sections = state.sections.filter((section) => section.notebookId === action.id);
      const section = sections[0];
      const pages = section ? pagesInSection(state, section.id) : [];
      return {
        state: {
          ...state,
          activeNotebookId: action.id,
          activeSectionId: section?.id ?? "",
          activePageId: pages[0]?.id ?? null,
        },
        undo: null,
      };
    }
    case "create-notebook": {
      const created = stamp();
      const color = SECTION_COLORS[state.notebooks.length % SECTION_COLORS.length];
      const notebook: Notebook = {
        id: action.id,
        name: "Untitled notebook",
        color,
        createdAt: created,
        updatedAt: created,
      };
      const section: Section = {
        id: action.sectionId,
        notebookId: action.id,
        name: "New Section",
        color,
        createdAt: created,
        updatedAt: created,
      };
      const page: Page = {
        id: action.pageId,
        sectionId: action.sectionId,
        title: "",
        body: "",
        createdAt: created,
        updatedAt: created,
      };
      return {
        state: {
          ...state,
          notebooks: [...state.notebooks, notebook],
          sections: [...state.sections, section],
          pages: [page, ...state.pages],
          activeNotebookId: notebook.id,
          activeSectionId: section.id,
          activePageId: page.id,
        },
        undo: null,
      };
    }
    case "rename-notebook": {
      const name = action.name.trim().slice(0, 80);
      const notebook = state.notebooks.find((item) => item.id === action.id);
      if (!notebook || !name || name === notebook.name) return { state, undo: null };
      return {
        state: {
          ...state,
          notebooks: state.notebooks.map((item) =>
            item.id === notebook.id ? { ...item, name, updatedAt: stamp() } : item,
          ),
        },
        undo: null,
      };
    }
    case "delete-notebook": {
      if (state.notebooks.length < 2) return { state, undo: null };
      const notebook = state.notebooks.find((item) => item.id === action.id);
      if (!notebook) return { state, undo: null };
      const removedSections = state.sections.filter((section) => section.notebookId === notebook.id);
      const removedIds = new Set(removedSections.map((section) => section.id));
      const removedPages = state.pages.filter((page) => removedIds.has(page.sectionId));
      const notebooks = state.notebooks.filter((item) => item.id !== notebook.id);
      const nextNotebook = notebooks[0];
      const nextSections = state.sections.filter((section) => section.notebookId === nextNotebook.id);
      const nextSection = nextSections[0];
      const remainingPages = state.pages.filter((page) => !removedIds.has(page.sectionId));
      const nextPages = nextSection ? pagesInSection({ ...state, pages: remainingPages }, nextSection.id) : [];
      const activeStillHere = state.activeNotebookId !== notebook.id;
      return {
        state: {
          ...state,
          notebooks,
          sections: state.sections.filter((section) => section.notebookId !== notebook.id),
          pages: remainingPages,
          activeNotebookId: activeStillHere ? state.activeNotebookId : nextNotebook.id,
          activeSectionId: activeStillHere ? state.activeSectionId : (nextSection?.id ?? ""),
          activePageId: activeStillHere ? state.activePageId : (nextPages[0]?.id ?? null),
        },
        undo: {
          kind: "notebook",
          label: "Notebook deleted",
          notebook,
          sections: removedSections,
          pages: removedPages,
          activeNotebookId: state.activeNotebookId,
          activeSectionId: state.activeSectionId,
          activePageId: state.activePageId,
        },
      };
    }
    case "select-section": {
      const section = state.sections.find((item) => item.id === action.id);
      if (!section) return { state, undo: null };
      const pages = pagesInSection(state, section.id);
      return {
        state: {
          ...state,
          activeNotebookId: section.notebookId,
          activeSectionId: section.id,
          activePageId: pages[0]?.id ?? null,
        },
        undo: null,
      };
    }
    case "create-section": {
      if (!state.notebooks.some((notebook) => notebook.id === state.activeNotebookId)) return { state, undo: null };
      const created = stamp();
      const count = state.sections.filter((section) => section.notebookId === state.activeNotebookId).length;
      const section: Section = {
        id: action.id,
        notebookId: state.activeNotebookId,
        name: "New Section",
        color: SECTION_COLORS[count % SECTION_COLORS.length],
        createdAt: created,
        updatedAt: created,
      };
      const page: Page = {
        id: action.pageId,
        sectionId: action.id,
        title: "",
        body: "",
        createdAt: created,
        updatedAt: created,
      };
      return {
        state: {
          ...state,
          sections: [...state.sections, section],
          pages: [page, ...state.pages],
          activeSectionId: section.id,
          activePageId: page.id,
        },
        undo: null,
      };
    }
    case "rename-section": {
      const name = action.name.trim().slice(0, 80);
      const section = state.sections.find((item) => item.id === action.id);
      if (!section || !name || name === section.name) return { state, undo: null };
      return {
        state: {
          ...state,
          sections: state.sections.map((item) =>
            item.id === section.id ? { ...item, name, updatedAt: stamp() } : item,
          ),
        },
        undo: null,
      };
    }
    case "recolor-section": {
      const section = state.sections.find((item) => item.id === action.id);
      if (!section || section.color === action.color) return { state, undo: null };
      return {
        state: {
          ...state,
          sections: state.sections.map((item) => (item.id === section.id ? { ...item, color: action.color } : item)),
        },
        undo: null,
      };
    }
    case "delete-section": {
      const section = state.sections.find((item) => item.id === action.id);
      if (!section) return { state, undo: null };
      const removedPages = state.pages.filter((page) => page.sectionId === section.id);
      const sections = state.sections.filter((item) => item.id !== section.id);
      const pages = state.pages.filter((page) => page.sectionId !== section.id);
      const siblings = sections.filter((item) => item.notebookId === section.notebookId);
      const wasActive = state.activeSectionId === section.id || removedPages.some((page) => page.id === state.activePageId);
      const neighbor = siblings[0];
      const neighborPages = neighbor ? pagesInSection({ ...state, pages }, neighbor.id) : [];
      return {
        state: {
          ...state,
          sections,
          pages,
          activeSectionId: wasActive ? (neighbor?.id ?? "") : state.activeSectionId,
          activePageId: wasActive ? (neighborPages[0]?.id ?? null) : state.activePageId,
        },
        undo: {
          kind: "section",
          label: "Section deleted",
          section,
          pages: removedPages,
          activeNotebookId: state.activeNotebookId,
          activeSectionId: state.activeSectionId,
          activePageId: state.activePageId,
        },
      };
    }
    case "select-page": {
      const page = state.pages.find((item) => item.id === action.id);
      if (!page) return { state, undo: null };
      const section = state.sections.find((item) => item.id === page.sectionId);
      if (!section) return { state, undo: null };
      return {
        state: {
          ...state,
          activeNotebookId: section.notebookId,
          activeSectionId: section.id,
          activePageId: page.id,
        },
        undo: null,
      };
    }
    case "create-page": {
      const section = state.sections.find(
        (item) => item.id === state.activeSectionId && item.notebookId === state.activeNotebookId,
      );
      if (!section) return { state, undo: null };
      const created = stamp();
      const page: Page = {
        id: action.id,
        sectionId: section.id,
        title: "",
        body: "",
        createdAt: created,
        updatedAt: created,
      };
      return {
        state: { ...state, pages: [page, ...state.pages], activePageId: page.id },
        undo: null,
      };
    }
    case "update-page": {
      const page = state.pages.find((item) => item.id === action.id);
      if (!page) return { state, undo: null };
      const title = action.title !== undefined ? action.title.slice(0, 500) : page.title;
      const body = action.body !== undefined ? action.body.slice(0, 400_000) : page.body;
      if (title === page.title && body === page.body) return { state, undo: null };
      return {
        state: {
          ...state,
          pages: state.pages.map((item) => (item.id === page.id ? { ...item, title, body, updatedAt: stamp() } : item)),
        },
        undo: null,
      };
    }
    case "delete-page": {
      const page = state.pages.find((item) => item.id === action.id);
      if (!page) return { state, undo: null };
      const list = pagesInSection(state, page.sectionId);
      const index = list.findIndex((item) => item.id === page.id);
      const neighbor = list[index + 1] ?? list[index - 1] ?? null;
      return {
        state: {
          ...state,
          pages: state.pages.filter((item) => item.id !== page.id),
          activePageId: state.activePageId === page.id ? (neighbor?.id ?? null) : state.activePageId,
        },
        undo: {
          kind: "page",
          label: "Page deleted",
          page,
          activeNotebookId: state.activeNotebookId,
          activeSectionId: state.activeSectionId,
          activePageId: state.activePageId,
        },
      };
    }
    case "duplicate-page": {
      const page = state.pages.find((item) => item.id === action.id);
      if (!page) return { state, undo: null };
      const created = stamp();
      const copy: Page = {
        ...page,
        id: action.newId,
        title: page.title.trim() ? `Copy of ${page.title.trim()}` : "Copy of Untitled page",
        createdAt: created,
        updatedAt: created,
      };
      return {
        state: { ...state, pages: [copy, ...state.pages], activePageId: copy.id },
        undo: null,
      };
    }
    case "move-page": {
      const page = state.pages.find((item) => item.id === action.id);
      const section = state.sections.find((item) => item.id === action.sectionId);
      if (!page || !section || page.sectionId === section.id) return { state, undo: null };
      return {
        state: {
          ...state,
          pages: state.pages.map((item) =>
            item.id === page.id ? { ...item, sectionId: section.id, updatedAt: stamp() } : item,
          ),
          activeNotebookId: section.notebookId,
          activeSectionId: section.id,
          activePageId: page.id,
        },
        undo: null,
      };
    }
    case "set-view":
      if (state.viewMode === action.mode) return { state, undo: null };
      return { state: { ...state, viewMode: action.mode }, undo: null };
    default:
      return { state, undo: null };
  }
}

export function restore(state: NotesState, undo: UndoRecord): NotesState {
  if (undo.kind === "page") {
    if (!state.sections.some((section) => section.id === undo.page.sectionId)) return state;
    const pages = state.pages.some((page) => page.id === undo.page.id) ? state.pages : [...state.pages, undo.page];
    return repair({
      ...state,
      pages,
      activeNotebookId: undo.activeNotebookId,
      activeSectionId: undo.activeSectionId,
      activePageId: undo.activePageId,
    });
  }
  if (undo.kind === "section") {
    if (!state.notebooks.some((notebook) => notebook.id === undo.section.notebookId)) return state;
    const sections = state.sections.some((section) => section.id === undo.section.id)
      ? state.sections
      : [...state.sections, undo.section];
    const known = new Set(state.pages.map((page) => page.id));
    const pages = [...state.pages, ...undo.pages.filter((page) => !known.has(page.id))];
    return repair({
      ...state,
      sections,
      pages,
      activeNotebookId: undo.activeNotebookId,
      activeSectionId: undo.activeSectionId,
      activePageId: undo.activePageId,
    });
  }
  const notebooks = state.notebooks.some((notebook) => notebook.id === undo.notebook.id)
    ? state.notebooks
    : [...state.notebooks, undo.notebook];
  const knownSections = new Set(state.sections.map((section) => section.id));
  const knownPages = new Set(state.pages.map((page) => page.id));
  return repair({
    ...state,
    notebooks,
    sections: [...state.sections, ...undo.sections.filter((section) => !knownSections.has(section.id))],
    pages: [...state.pages, ...undo.pages.filter((page) => !knownPages.has(page.id))],
    activeNotebookId: undo.activeNotebookId,
    activeSectionId: undo.activeSectionId,
    activePageId: undo.activePageId,
  });
}

export function loadState(): NotesState | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = stateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    return repair(parsed.data);
  } catch {
    return null;
  }
}

export function saveState(state: NotesState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
