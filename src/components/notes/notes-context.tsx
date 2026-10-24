import {
  apply,
  createSeed,
  loadState,
  pagesInSection,
  restore,
  saveState,
  searchPages,
  type Action,
  type NotesState,
  type Page,
  type SectionColor,
  type UndoRecord,
  type ViewMode,
} from "@/lib/notes/model";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { ConfirmDialog, type ConfirmRequest } from "./dialogs";

type RenameTarget = { kind: "notebook" | "section"; id: string } | null;
type MobilePane = "list" | "editor";

type NotesApi = {
  doc: NotesState;
  undo: UndoRecord | null;
  query: string;
  setQuery: (value: string) => void;
  searchAll: boolean;
  setSearchAll: (value: boolean) => void;
  mobilePane: MobilePane;
  setMobilePane: (pane: MobilePane) => void;
  chromeHidden: boolean;
  setChromeHidden: (value: boolean | ((value: boolean) => boolean)) => void;
  focusTick: number;
  renaming: RenameTarget;
  setRenaming: (target: RenameTarget) => void;
  saveError: boolean;
  wide: boolean;
  searchRef: RefObject<HTMLInputElement | null>;
  modLabel: string;
  altLabel: string;
  visiblePages: Page[];
  effectiveView: ViewMode;
  selectNotebook: (id: string) => void;
  createNotebook: () => void;
  renameNotebook: (id: string, name: string) => void;
  deleteNotebook: (id: string) => void;
  selectSection: (id: string) => void;
  createSection: () => void;
  renameSection: (id: string, name: string) => void;
  recolorSection: (id: string, color: SectionColor) => void;
  deleteSection: (id: string) => void;
  openPage: (id: string) => void;
  selectPage: (id: string) => void;
  createPage: () => void;
  updatePage: (id: string, patch: { title?: string; body?: string }) => void;
  deletePage: (id: string) => Promise<void>;
  duplicatePage: (id: string) => void;
  movePage: (id: string, sectionId: string) => void;
  setView: (mode: ViewMode) => void;
  cycleView: () => void;
  moveSelection: (delta: number) => void;
  focusPageButton: (id: string) => void;
  confirm: (request: ConfirmRequest) => Promise<boolean>;
  performUndo: () => void;
  dismissUndo: () => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
};

const NotesContext = createContext<NotesApi | null>(null);

export function useNotes() {
  const value = useContext(NotesContext);
  if (!value) throw new Error("Notes are unavailable");
  return value;
}

function listPages(doc: NotesState, query: string, searchAll: boolean): Page[] {
  if (!query.trim()) return pagesInSection(doc, doc.activeSectionId);
  return searchPages(doc, searchAll ? "all" : doc.activeNotebookId, query);
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(() => ({
    doc: loadState() ?? createSeed(),
    undo: null as UndoRecord | null,
  }));
  const [query, setQuery] = useState("");
  const [searchAll, setSearchAll] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>("list");
  const [chromeHidden, setChromeHiddenState] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const [renaming, setRenaming] = useState<RenameTarget>(null);
  const [saveError, setSaveError] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [confirmRequest, setConfirmRequest] = useState<(ConfirmRequest & { resolve: (ok: boolean) => void }) | null>(
    null,
  );
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  const searchRef = useRef<HTMLInputElement>(null);
  const docRef = useRef(store.doc);
  const queryRef = useRef(query);
  const searchAllRef = useRef(searchAll);
  const helpRef = useRef(helpOpen);
  const confirmRef = useRef(false);
  const settledRef = useRef(false);
  const renamingRef = useRef(renaming);
  docRef.current = store.doc;
  queryRef.current = query;
  searchAllRef.current = searchAll;
  helpRef.current = helpOpen;
  confirmRef.current = confirmRequest !== null;
  renamingRef.current = renaming;

  const mac = /Mac|iPhone|iPad/.test(navigator.userAgent);
  const modLabel = mac ? "⌘" : "Ctrl";
  const altLabel = mac ? "⌥" : "Alt";

  const dispatch = useCallback((action: Action) => {
    setStore((prev) => {
      const result = apply(prev.doc, action);
      return { doc: result.state, undo: result.undo ?? prev.undo };
    });
  }, []);

  useEffect(() => {
    setSaveError(!saveState(store.doc));
  }, [store.doc]);

  useEffect(() => {
    if (!store.undo) return;
    const id = window.setTimeout(() => {
      setStore((prev) => (prev.undo ? { ...prev, undo: null } : prev));
    }, 6000);
    return () => window.clearTimeout(id);
  }, [store.undo]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setWide(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const confirm = useCallback((request: ConfirmRequest) => {
    settledRef.current = false;
    return new Promise<boolean>((resolve) => {
      setConfirmRequest({ ...request, resolve });
    });
  }, []);

  const closeConfirm = useCallback((ok: boolean) => {
    if (settledRef.current) return;
    settledRef.current = true;
    setConfirmRequest((current) => {
      current?.resolve(ok);
      return null;
    });
  }, []);

  const setChromeHidden = useCallback((value: boolean | ((value: boolean) => boolean)) => {
    setChromeHiddenState((prev) => (typeof value === "function" ? value(prev) : value));
  }, []);

  const visiblePages = useMemo(
    () => listPages(store.doc, query, searchAll),
    [store.doc, query, searchAll],
  );

  const effectiveView: ViewMode = !wide && store.doc.viewMode === "split" ? "edit" : store.doc.viewMode;

  const openPage = useCallback(
    (id: string) => {
      dispatch({ type: "select-page", id });
      if (window.innerWidth < 768) setMobilePane("editor");
    },
    [dispatch],
  );

  const createPage = useCallback(() => {
    const doc = docRef.current;
    if (!doc.sections.some((section) => section.id === doc.activeSectionId)) return;
    const id = crypto.randomUUID();
    dispatch({ type: "create-page", id });
    setQuery("");
    setRenaming(null);
    setChromeHiddenState(false);
    setMobilePane("editor");
    setFocusTick((tick) => tick + 1);
  }, [dispatch]);

  const createSection = useCallback(() => {
    const id = crypto.randomUUID();
    const pageId = crypto.randomUUID();
    dispatch({ type: "create-section", id, pageId });
    setQuery("");
    setRenaming({ kind: "section", id });
    setChromeHiddenState(false);
    setMobilePane("list");
  }, [dispatch]);

  const createNotebook = useCallback(() => {
    const id = crypto.randomUUID();
    dispatch({
      type: "create-notebook",
      id,
      sectionId: crypto.randomUUID(),
      pageId: crypto.randomUUID(),
    });
    setQuery("");
    setRenaming({ kind: "notebook", id });
    setChromeHiddenState(false);
    setMobilePane("list");
  }, [dispatch]);

  const deletePage = useCallback(
    async (id: string) => {
      const page = docRef.current.pages.find((item) => item.id === id);
      if (!page) return;
      const title = page.title.trim() || "Untitled page";
      const ok = await confirm({
        title: `Delete “${title}”?`,
        description: "The page leaves this notebook. You can undo it for a few seconds.",
        confirmLabel: "Delete page",
        tone: "danger",
      });
      if (!ok) return;
      dispatch({ type: "delete-page", id });
    },
    [confirm, dispatch],
  );

  const deleteSection = useCallback(
    async (id: string) => {
      const section = docRef.current.sections.find((item) => item.id === id);
      if (!section) return;
      const count = docRef.current.pages.filter((page) => page.sectionId === id).length;
      const ok = await confirm({
        title: `Delete “${section.name}”?`,
        description:
          count === 0
            ? "This section is empty."
            : `This also deletes ${count} ${count === 1 ? "page" : "pages"}. You can undo it for a few seconds.`,
        confirmLabel: "Delete section",
        tone: "danger",
      });
      if (!ok) return;
      dispatch({ type: "delete-section", id });
      setRenaming((current) => (current?.id === id ? null : current));
    },
    [confirm, dispatch],
  );

  const deleteNotebook = useCallback(
    async (id: string) => {
      if (docRef.current.notebooks.length < 2) return;
      const notebook = docRef.current.notebooks.find((item) => item.id === id);
      if (!notebook) return;
      const ok = await confirm({
        title: `Delete “${notebook.name}”?`,
        description: "Sections and pages inside it are deleted too. You can undo it for a few seconds.",
        confirmLabel: "Delete notebook",
        tone: "danger",
      });
      if (!ok) return;
      dispatch({ type: "delete-notebook", id });
      setRenaming((current) => (current?.id === id ? null : current));
    },
    [confirm, dispatch],
  );

  const selectNotebook = useCallback(
    (id: string) => {
      dispatch({ type: "select-notebook", id });
      setQuery("");
      setMobilePane("list");
    },
    [dispatch],
  );

  const selectSection = useCallback(
    (id: string) => {
      dispatch({ type: "select-section", id });
      setQuery("");
    },
    [dispatch],
  );

  const cycleView = useCallback(() => {
    const doc = docRef.current;
    const isWide = window.matchMedia("(min-width: 1024px)").matches;
    const order: ViewMode[] = isWide ? ["edit", "split", "preview"] : ["edit", "preview"];
    const current: ViewMode = !isWide && doc.viewMode === "split" ? "edit" : doc.viewMode;
    const next = order[(order.indexOf(current) + 1) % order.length];
    dispatch({ type: "set-view", mode: next });
  }, [dispatch]);

  const moveSelection = useCallback(
    (delta: number) => {
      const pages = listPages(docRef.current, queryRef.current, searchAllRef.current);
      if (pages.length === 0) return;
      const index = pages.findIndex((page) => page.id === docRef.current.activePageId);
      const start = index < 0 ? (delta > 0 ? 0 : pages.length - 1) : index + delta;
      const next = pages[Math.min(pages.length - 1, Math.max(0, start))];
      if (next) dispatch({ type: "select-page", id: next.id });
    },
    [dispatch],
  );

  const focusPageButton = useCallback((id: string) => {
    window.requestAnimationFrame(() => {
      document.getElementById(`page-${id}`)?.focus();
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (confirmRef.current || helpRef.current) return;
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      const mod = event.metaKey || event.ctrlKey;

      if (event.key === "Escape") {
        if (renamingRef.current) return;
        if (document.activeElement === searchRef.current) {
          if (queryRef.current) setQuery("");
          else searchRef.current?.blur();
          return;
        }
        if (typing) {
          (document.activeElement as HTMLElement | null)?.blur();
          return;
        }
        if (window.innerWidth < 768) {
          setMobilePane("list");
          setChromeHiddenState(false);
          return;
        }
        setChromeHiddenState(false);
        return;
      }

      if (event.repeat && !(event.altKey && event.key.startsWith("Arrow"))) return;

      if (mod && event.code === "KeyK") {
        event.preventDefault();
        setChromeHiddenState(false);
        setMobilePane("list");
        window.requestAnimationFrame(() => {
          searchRef.current?.focus();
          searchRef.current?.select();
        });
        return;
      }

      if (mod && !event.shiftKey && event.code === "Backslash") {
        event.preventDefault();
        cycleView();
        return;
      }

      if (mod && event.shiftKey && event.code === "Backslash") {
        event.preventDefault();
        setChromeHiddenState((hidden) => !hidden);
        setMobilePane("editor");
        return;
      }

      if (event.altKey && !mod && !event.shiftKey && event.code === "KeyN") {
        event.preventDefault();
        createPage();
        return;
      }

      if (event.altKey && event.shiftKey && !mod && event.code === "KeyN") {
        event.preventDefault();
        createSection();
        return;
      }

      if (event.altKey && event.shiftKey && !mod && event.code === "KeyB") {
        event.preventDefault();
        createNotebook();
        return;
      }

      if (mod && event.shiftKey && (event.key === "Backspace" || event.key === "Delete")) {
        event.preventDefault();
        const id = docRef.current.activePageId;
        if (id) void deletePage(id);
        return;
      }

      if (event.altKey && !mod && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        moveSelection(event.key === "ArrowDown" ? 1 : -1);
        return;
      }

      if (!typing && !mod && event.key === "?") {
        event.preventDefault();
        setHelpOpen(true);
      }

      if (
        !typing &&
        document.activeElement === searchRef.current &&
        (event.key === "ArrowDown" || event.key === "ArrowUp")
      ) {
        event.preventDefault();
        const pages = listPages(docRef.current, queryRef.current, searchAllRef.current);
        if (pages.length === 0) return;
        const index = pages.findIndex((page) => page.id === docRef.current.activePageId);
        const nextIndex =
          event.key === "ArrowDown" ? (index < 0 ? 0 : Math.min(pages.length - 1, index + 1)) : Math.max(0, index < 0 ? 0 : index - 1);
        const next = pages[nextIndex];
        if (!next) return;
        dispatch({ type: "select-page", id: next.id });
        window.requestAnimationFrame(() => document.getElementById(`page-${next.id}`)?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createNotebook, createPage, createSection, cycleView, deletePage, dispatch, moveSelection]);

  const api = useMemo<NotesApi>(
    () => ({
      doc: store.doc,
      undo: store.undo,
      query,
      setQuery,
      searchAll,
      setSearchAll,
      mobilePane,
      setMobilePane,
      chromeHidden,
      setChromeHidden,
      focusTick,
      renaming,
      setRenaming,
      saveError,
      wide,
      searchRef,
      modLabel,
      altLabel,
      visiblePages,
      effectiveView,
      selectNotebook,
      createNotebook,
      renameNotebook: (id, name) => dispatch({ type: "rename-notebook", id, name }),
      deleteNotebook,
      selectSection,
      createSection,
      renameSection: (id, name) => dispatch({ type: "rename-section", id, name }),
      recolorSection: (id, color) => dispatch({ type: "recolor-section", id, color }),
      deleteSection,
      openPage,
      selectPage: (id) => dispatch({ type: "select-page", id }),
      createPage,
      updatePage: (id, patch) => dispatch({ type: "update-page", id, ...patch }),
      deletePage,
      duplicatePage: (id) => {
        dispatch({ type: "duplicate-page", id, newId: crypto.randomUUID() });
        setChromeHiddenState(false);
        setMobilePane("editor");
      },
      movePage: (id, sectionId) => dispatch({ type: "move-page", id, sectionId }),
      setView: (mode) => dispatch({ type: "set-view", mode }),
      cycleView,
      moveSelection,
      focusPageButton,
      confirm,
      performUndo: () => {
        setStore((prev) => (prev.undo ? { doc: restore(prev.doc, prev.undo), undo: null } : prev));
      },
      dismissUndo: () => setStore((prev) => ({ ...prev, undo: null })),
      helpOpen,
      setHelpOpen,
    }),
    [
      store.doc,
      store.undo,
      query,
      searchAll,
      mobilePane,
      chromeHidden,
      setChromeHidden,
      focusTick,
      renaming,
      saveError,
      wide,
      modLabel,
      altLabel,
      visiblePages,
      effectiveView,
      selectNotebook,
      createNotebook,
      deleteNotebook,
      selectSection,
      createSection,
      deleteSection,
      openPage,
      createPage,
      deletePage,
      cycleView,
      moveSelection,
      focusPageButton,
      confirm,
      helpOpen,
      dispatch,
    ],
  );

  return (
    <NotesContext.Provider value={api}>
      {children}
      <ConfirmDialog
        request={confirmRequest}
        onCancel={() => closeConfirm(false)}
        onConfirm={() => closeConfirm(true)}
      />
    </NotesContext.Provider>
  );
}
