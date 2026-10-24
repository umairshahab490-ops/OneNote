import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime, a as AlertDialogDescription, c as AlertDialogTitle, d as DialogContent, f as DialogDescription, h as DialogTitle, i as AlertDialogContent, l as Dialog, m as DialogPortal, n as AlertDialogAction, o as AlertDialogOverlay, p as DialogOverlay, r as AlertDialogCancel, s as AlertDialogPortal, t as AlertDialog, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as ChevronLeft, S as Code, T as Bold, _ as Heading2, a as Search, b as Ellipsis, c as PenLine, d as List, f as ListTodo, g as Italic, h as Keyboard, i as Strikethrough, l as PanelLeftOpen, m as Link, o as Quote, p as ListOrdered, r as Trash2, s as Plus, t as X, u as PanelLeftClose, v as Heading1, w as ChevronDown, x as Columns2, y as Eye } from "../_libs/lucide-react.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { t as Sn } from "../_libs/marked.mjs";
import { n as format, t as formatDistanceToNowStrict } from "../_libs/date-fns.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuPortal, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bdyuax3A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function lineBounds(value, start, end) {
	const lineStart = value.lastIndexOf("\n", Math.max(0, start) - 1) + 1;
	const lineEndIdx = value.indexOf("\n", end);
	return {
		lineStart,
		lineEnd: lineEndIdx === -1 ? value.length : lineEndIdx
	};
}
function wrapSelection(value, start, end, before, after) {
	const selected = value.slice(start, end);
	const next = value.slice(0, start) + before + selected + after + value.slice(end);
	const selectionStart = start + before.length;
	return {
		value: next,
		selectionStart,
		selectionEnd: selectionStart + selected.length
	};
}
function toggleLinePrefix(value, start, end, prefix) {
	const { lineStart, lineEnd } = lineBounds(value, start, end);
	const lines = value.slice(lineStart, lineEnd).split("\n");
	const meaningful = lines.filter((line) => line.length > 0);
	const allHave = meaningful.length > 0 && meaningful.every((line) => line.startsWith(prefix));
	const nextBlock = lines.map((line) => {
		if (!line) return line;
		if (allHave) return line.startsWith(prefix) ? line.slice(prefix.length) : line;
		return line.startsWith(prefix) ? line : prefix + line;
	}).join("\n");
	return {
		value: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
		selectionStart: lineStart,
		selectionEnd: lineStart + nextBlock.length
	};
}
function insertLink(value, start, end) {
	const selected = value.slice(start, end);
	if (!selected) return {
		value: value.slice(0, start) + "[text](https://)" + value.slice(end),
		selectionStart: start + 1,
		selectionEnd: start + 5
	};
	const insert = `[${selected}](https://)`;
	const urlStart = start + selected.length + 3;
	return {
		value: value.slice(0, start) + insert + value.slice(end),
		selectionStart: urlStart,
		selectionEnd: urlStart + 8
	};
}
function insertCode(value, start, end) {
	const selected = value.slice(start, end);
	if (selected.includes("\n")) {
		const insert = "```\n" + selected + "\n```";
		return {
			value: value.slice(0, start) + insert + value.slice(end),
			selectionStart: start + 4,
			selectionEnd: start + 4 + selected.length
		};
	}
	return wrapSelection(value, start, end, "`", "`");
}
function indentSelection(value, start, end, outdent) {
	if (!outdent && start === end) return {
		value: value.slice(0, start) + "  " + value.slice(end),
		selectionStart: start + 2,
		selectionEnd: start + 2
	};
	const { lineStart, lineEnd } = lineBounds(value, start, end);
	const nextBlock = value.slice(lineStart, lineEnd).split("\n").map((line) => {
		if (outdent) {
			if (line.startsWith("  ")) return line.slice(2);
			if (line.startsWith("	")) return line.slice(1);
			return line;
		}
		return "  " + line;
	}).join("\n");
	return {
		value: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
		selectionStart: lineStart,
		selectionEnd: lineStart + nextBlock.length
	};
}
function toggleTask(body, raw) {
	const flipped = raw.includes("[ ]") ? raw.replace("[ ]", "[x]") : raw.replace(/\[[xX]\]/, "[ ]");
	if (flipped === raw) return body;
	const index = body.indexOf(raw);
	if (index < 0) return body;
	return body.slice(0, index) + flipped + body.slice(index + raw.length);
}
var taskToggle;
function safeUrl(href) {
	const trimmed = href.trim();
	try {
		const url = new URL(trimmed);
		if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") return trimmed;
	} catch {
		return null;
	}
	return null;
}
function stripCheckbox(tokens) {
	return tokens.filter((token) => token.type !== "checkbox").map((token) => {
		if ("tokens" in token && Array.isArray(token.tokens)) return {
			...token,
			tokens: stripCheckbox(token.tokens)
		};
		return token;
	});
}
function renderTokens(tokens, keyPrefix) {
	if (!tokens?.length) return null;
	return tokens.map((token, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: renderToken(token, `${keyPrefix}-${index}`) }, `${keyPrefix}-${index}`));
}
function renderToken(token, key, onToggleTask) {
	switch (token.type) {
		case "space":
		case "def": return null;
		case "br": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {});
		case "hr": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {});
		case "escape": return token.text;
		case "html": {
			const html = token;
			const Tag = html.block ? "p" : "span";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				className: "text-muted",
				children: html.text
			});
		}
		case "heading": {
			const heading = token;
			const Tag = [
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6"
			][Math.min(5, Math.max(0, heading.depth - 1))];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: renderTokens(heading.tokens, key) });
		}
		case "paragraph": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: renderTokens(token.tokens, key) });
		case "blockquote": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { children: renderTokens(token.tokens, key) });
		case "code": {
			const code = token;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", { children: [code.lang ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "code-lang",
				children: code.lang
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code.text.replace(/\n$/, "") })] });
		}
		case "list": {
			const list = token;
			const Tag = list.ordered ? "ol" : "ul";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				start: list.ordered && typeof list.start === "number" ? list.start : void 0,
				children: list.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: item.task ? "task" : void 0,
					children: [item.task ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: Boolean(item.checked),
						"aria-label": item.checked ? "Completed task" : "Open task",
						onChange: () => taskToggle?.(item.raw)
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderTokens(item.task ? stripCheckbox(item.tokens) : item.tokens, `${key}-item-${index}`) })]
				}, `${key}-item-${index}`))
			});
		}
		case "table": {
			const table = token;
			const alignClass = (align) => align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-wrap",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: table.header.map((cell, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: alignClass(cell.align),
					children: renderTokens(cell.tokens, `${key}-h-${index}`)
				}, `${key}-h-${index}`)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: table.rows.map((row, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: row.map((cell, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: alignClass(cell.align),
					children: renderTokens(cell.tokens, `${key}-c-${rowIndex}-${index}`)
				}, `${key}-c-${rowIndex}-${index}`)) }, `${key}-r-${rowIndex}`)) })] })
			});
		}
		case "text": {
			const text = token;
			if (text.tokens?.length) return renderTokens(text.tokens, key);
			return text.text;
		}
		case "strong": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: renderTokens(token.tokens, key) });
		case "em": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: renderTokens(token.tokens, key) });
		case "del": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("del", { children: renderTokens(token.tokens, key) });
		case "codespan": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: token.text });
		case "checkbox": return null;
		case "link": {
			const link = token;
			const href = safeUrl(link.href);
			if (!href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: renderTokens(link.tokens, key) });
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href,
				target: href.startsWith("mailto:") ? void 0 : "_blank",
				rel: "noreferrer",
				children: renderTokens(link.tokens, key)
			});
		}
		case "image": {
			const image = token;
			const href = safeUrl(image.href);
			if (!href || href.startsWith("mailto:")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: image.text });
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: href,
				alt: image.text,
				loading: "lazy",
				referrerPolicy: "no-referrer"
			});
		}
		default:
			if ("tokens" in token && Array.isArray(token.tokens)) return renderTokens(token.tokens, key);
			if ("text" in token && typeof token.text === "string") return token.text;
			return null;
	}
}
function renderBlock(token, key, onToggleTask) {
	if (token.type === "list") {
		const list = token;
		const Tag = list.ordered ? "ol" : "ul";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			start: list.ordered && typeof list.start === "number" ? list.start : void 0,
			children: list.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: item.task ? "task" : void 0,
				children: [item.task ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: Boolean(item.checked),
					"aria-label": item.checked ? "Completed task" : "Open task",
					onChange: () => taskToggle?.(item.raw)
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderTokens(item.task ? stripCheckbox(item.tokens) : item.tokens, `${key}-item-${index}`) })]
			}, `${key}-item-${index}`))
		});
	}
	return renderToken(token, key, onToggleTask);
}
function MarkdownView({ source, onToggleTask }) {
	taskToggle = onToggleTask;
	const tokens = (0, import_react.useMemo)(() => {
		try {
			return Sn(source, {
				gfm: true,
				breaks: true
			});
		} catch {
			return null;
		}
	}, [source]);
	if (!source.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "empty-preview",
		children: "Nothing to preview yet."
	});
	if (!tokens) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "fallback-preview",
		children: source
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "note-md",
		children: tokens.map((token, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: renderBlock(token, `b-${index}`, onToggleTask) }, index))
	});
}
function Highlight({ text, query }) {
	const needle = query.trim();
	if (!needle) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text });
	const lower = text.toLowerCase();
	const target = needle.toLowerCase();
	const parts = [];
	let cursor = 0;
	while (cursor < text.length) {
		const at = lower.indexOf(target, cursor);
		if (at < 0) {
			parts.push({
				text: text.slice(cursor),
				match: false
			});
			break;
		}
		if (at > cursor) parts.push({
			text: text.slice(cursor, at),
			match: false
		});
		parts.push({
			text: text.slice(at, at + target.length),
			match: true
		});
		cursor = at + target.length;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts.map((part, index) => part.match ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", { children: part.text }, index) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part.text }, index)) });
}
var SECTION_COLORS = [
	"plum",
	"slate",
	"sage",
	"clay",
	"ink"
];
var VIEW_MODES = [
	"edit",
	"split",
	"preview"
];
var STORAGE_KEY = "onenote-desk.v1";
var notebookSchema = object({
	id: string(),
	name: string(),
	color: _enum(SECTION_COLORS),
	createdAt: number(),
	updatedAt: number()
});
var sectionSchema = object({
	id: string(),
	notebookId: string(),
	name: string(),
	color: _enum(SECTION_COLORS),
	createdAt: number(),
	updatedAt: number()
});
var pageSchema = object({
	id: string(),
	sectionId: string(),
	title: string(),
	body: string(),
	createdAt: number(),
	updatedAt: number()
});
var stateSchema = object({
	notebooks: array(notebookSchema).min(1),
	sections: array(sectionSchema),
	pages: array(pageSchema),
	activeNotebookId: string(),
	activeSectionId: string(),
	activePageId: string().nullable(),
	viewMode: _enum(VIEW_MODES)
});
function createSeed(now = Date.now()) {
	const min = 6e4;
	const hour = 60 * min;
	const day = 24 * hour;
	const personal = "nb-personal";
	const work = "nb-work";
	const quick = "sec-quick";
	const meetings = "sec-meetings";
	const ideas = "sec-ideas";
	const projects = "sec-projects";
	return {
		notebooks: [{
			id: personal,
			name: "Personal",
			color: "plum",
			createdAt: now - 40 * day,
			updatedAt: now - 8 * min
		}, {
			id: work,
			name: "Work",
			color: "slate",
			createdAt: now - 12 * day,
			updatedAt: now - 2 * day
		}],
		sections: [
			{
				id: quick,
				notebookId: personal,
				name: "Quick Notes",
				color: "plum",
				createdAt: now - 40 * day,
				updatedAt: now - 8 * min
			},
			{
				id: meetings,
				notebookId: personal,
				name: "Meetings",
				color: "slate",
				createdAt: now - 20 * day,
				updatedAt: now - 3 * hour
			},
			{
				id: ideas,
				notebookId: personal,
				name: "Ideas",
				color: "sage",
				createdAt: now - 15 * day,
				updatedAt: now - 6 * hour
			},
			{
				id: projects,
				notebookId: work,
				name: "Projects",
				color: "clay",
				createdAt: now - 12 * day,
				updatedAt: now - 2 * day
			}
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
					"Delete anything you do not need. This welcome page is only a starting point."
				].join("\n"),
				createdAt: now - 40 * day,
				updatedAt: now - 8 * min
			},
			{
				id: "page-grocery",
				sectionId: quick,
				title: "Grocery run",
				body: [
					"## This week",
					"",
					"- [x] Oat milk",
					"- [ ] Lemons",
					"- [ ] Sourdough",
					"- [ ] Coffee beans",
					"",
					"## Already home",
					"",
					"- Eggs",
					"- Rice",
					"- Olive oil"
				].join("\n"),
				createdAt: now - 2 * day,
				updatedAt: now - 26 * hour
			},
			{
				id: "page-reading",
				sectionId: quick,
				title: "Reading list",
				body: [
					"## On the desk",
					"",
					"1. A short history of paper",
					"2. Notes on attention",
					"3. The design of everyday tools",
					"",
					"Leave a line under a title when a book earns a second look."
				].join("\n"),
				createdAt: now - 9 * day,
				updatedAt: now - 4 * day
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
					"- [x] File last week's pages"
				].join("\n"),
				createdAt: now - 6 * day,
				updatedAt: now - 3 * hour
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
					"```"
				].join("\n"),
				createdAt: now - 8 * day,
				updatedAt: now - 6 * hour
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
					"Ship when the page still makes sense with the sidebar closed."
				].join("\n"),
				createdAt: now - 5 * day,
				updatedAt: now - 2 * day
			}
		],
		activeNotebookId: personal,
		activeSectionId: quick,
		activePageId: "page-welcome",
		viewMode: "split"
	};
}
function pagesInSection(state, sectionId) {
	return state.pages.filter((page) => page.sectionId === sectionId);
}
function searchPages(state, notebookId, query) {
	const needle = query.trim().toLowerCase();
	if (!needle) return [];
	const allowed = new Set(notebookId === "all" ? state.sections.map((section) => section.id) : state.sections.filter((section) => section.notebookId === notebookId).map((section) => section.id));
	return state.pages.filter((page) => {
		if (!allowed.has(page.sectionId)) return false;
		return page.title.toLowerCase().includes(needle) || page.body.toLowerCase().includes(needle);
	}).sort((a, b) => b.updatedAt - a.updatedAt || b.createdAt - a.createdAt);
}
function previewLine(body, query = "") {
	const plain = body.replace(/```[\s\S]*?```/g, " ").split("\n").map((line) => line.replace(/^\s{0,3}(#{1,6}\s+|>\s+|[-*+]\s+|\d+\.\s+|\[[ xX]\]\s+)/, "").replace(/[*_`~]/g, "")).join(" ").replace(/\s+/g, " ").trim();
	const needle = query.trim().toLowerCase();
	if (!needle) return plain.slice(0, 110);
	const at = plain.toLowerCase().indexOf(needle);
	if (at < 0) return plain.slice(0, 110);
	const start = Math.max(0, at - 36);
	const slice = plain.slice(start, start + 110);
	return (start > 0 ? "…" : "") + slice;
}
function pageTitle(page) {
	return page.title.trim() || "Untitled page";
}
function wordCount(body) {
	const text = body.trim();
	if (!text) return 0;
	return text.split(/\s+/).length;
}
function editedLabel(ts, now = Date.now()) {
	const delta = now - ts;
	if (delta < 45e3) return "Just now";
	if (delta < 6048e5) return formatDistanceToNowStrict(new Date(ts), { addSuffix: true });
	return format(new Date(ts), "MMM d, yyyy");
}
function editedExact(ts) {
	return format(new Date(ts), "MMM d, yyyy 'at' h:mm a");
}
function repair(state) {
	const notebooks = state.notebooks.filter((notebook) => notebook.name.trim());
	if (notebooks.length === 0) return createSeed();
	const notebookIds = new Set(notebooks.map((notebook) => notebook.id));
	const sections = state.sections.filter((section) => notebookIds.has(section.notebookId) && section.name.trim());
	const sectionIds = new Set(sections.map((section) => section.id));
	const pages = state.pages.filter((page) => sectionIds.has(page.sectionId));
	const activeNotebookId = notebookIds.has(state.activeNotebookId) ? state.activeNotebookId : notebooks[0].id;
	const inNotebook = sections.filter((section) => section.notebookId === activeNotebookId);
	const activeSectionId = inNotebook.some((section) => section.id === state.activeSectionId) ? state.activeSectionId : inNotebook[0]?.id ?? "";
	const inSection = pages.filter((page) => page.sectionId === activeSectionId);
	return {
		notebooks,
		sections,
		pages,
		activeNotebookId,
		activeSectionId,
		activePageId: inSection.some((page) => page.id === state.activePageId) ? state.activePageId : inSection[0]?.id ?? null,
		viewMode: VIEW_MODES.includes(state.viewMode) ? state.viewMode : "edit"
	};
}
function stamp() {
	return Date.now();
}
function apply(state, action) {
	switch (action.type) {
		case "select-notebook": {
			if (!state.notebooks.some((notebook) => notebook.id === action.id)) return {
				state,
				undo: null
			};
			const section = state.sections.filter((section) => section.notebookId === action.id)[0];
			const pages = section ? pagesInSection(state, section.id) : [];
			return {
				state: {
					...state,
					activeNotebookId: action.id,
					activeSectionId: section?.id ?? "",
					activePageId: pages[0]?.id ?? null
				},
				undo: null
			};
		}
		case "create-notebook": {
			const created = stamp();
			const color = SECTION_COLORS[state.notebooks.length % SECTION_COLORS.length];
			const notebook = {
				id: action.id,
				name: "Untitled notebook",
				color,
				createdAt: created,
				updatedAt: created
			};
			const section = {
				id: action.sectionId,
				notebookId: action.id,
				name: "New Section",
				color,
				createdAt: created,
				updatedAt: created
			};
			const page = {
				id: action.pageId,
				sectionId: action.sectionId,
				title: "",
				body: "",
				createdAt: created,
				updatedAt: created
			};
			return {
				state: {
					...state,
					notebooks: [...state.notebooks, notebook],
					sections: [...state.sections, section],
					pages: [page, ...state.pages],
					activeNotebookId: notebook.id,
					activeSectionId: section.id,
					activePageId: page.id
				},
				undo: null
			};
		}
		case "rename-notebook": {
			const name = action.name.trim().slice(0, 80);
			const notebook = state.notebooks.find((item) => item.id === action.id);
			if (!notebook || !name || name === notebook.name) return {
				state,
				undo: null
			};
			return {
				state: {
					...state,
					notebooks: state.notebooks.map((item) => item.id === notebook.id ? {
						...item,
						name,
						updatedAt: stamp()
					} : item)
				},
				undo: null
			};
		}
		case "delete-notebook": {
			if (state.notebooks.length < 2) return {
				state,
				undo: null
			};
			const notebook = state.notebooks.find((item) => item.id === action.id);
			if (!notebook) return {
				state,
				undo: null
			};
			const removedSections = state.sections.filter((section) => section.notebookId === notebook.id);
			const removedIds = new Set(removedSections.map((section) => section.id));
			const removedPages = state.pages.filter((page) => removedIds.has(page.sectionId));
			const notebooks = state.notebooks.filter((item) => item.id !== notebook.id);
			const nextNotebook = notebooks[0];
			const nextSection = state.sections.filter((section) => section.notebookId === nextNotebook.id)[0];
			const remainingPages = state.pages.filter((page) => !removedIds.has(page.sectionId));
			const nextPages = nextSection ? pagesInSection({
				...state,
				pages: remainingPages
			}, nextSection.id) : [];
			const activeStillHere = state.activeNotebookId !== notebook.id;
			return {
				state: {
					...state,
					notebooks,
					sections: state.sections.filter((section) => section.notebookId !== notebook.id),
					pages: remainingPages,
					activeNotebookId: activeStillHere ? state.activeNotebookId : nextNotebook.id,
					activeSectionId: activeStillHere ? state.activeSectionId : nextSection?.id ?? "",
					activePageId: activeStillHere ? state.activePageId : nextPages[0]?.id ?? null
				},
				undo: {
					kind: "notebook",
					label: "Notebook deleted",
					notebook,
					sections: removedSections,
					pages: removedPages,
					activeNotebookId: state.activeNotebookId,
					activeSectionId: state.activeSectionId,
					activePageId: state.activePageId
				}
			};
		}
		case "select-section": {
			const section = state.sections.find((item) => item.id === action.id);
			if (!section) return {
				state,
				undo: null
			};
			const pages = pagesInSection(state, section.id);
			return {
				state: {
					...state,
					activeNotebookId: section.notebookId,
					activeSectionId: section.id,
					activePageId: pages[0]?.id ?? null
				},
				undo: null
			};
		}
		case "create-section": {
			if (!state.notebooks.some((notebook) => notebook.id === state.activeNotebookId)) return {
				state,
				undo: null
			};
			const created = stamp();
			const count = state.sections.filter((section) => section.notebookId === state.activeNotebookId).length;
			const section = {
				id: action.id,
				notebookId: state.activeNotebookId,
				name: "New Section",
				color: SECTION_COLORS[count % SECTION_COLORS.length],
				createdAt: created,
				updatedAt: created
			};
			const page = {
				id: action.pageId,
				sectionId: action.id,
				title: "",
				body: "",
				createdAt: created,
				updatedAt: created
			};
			return {
				state: {
					...state,
					sections: [...state.sections, section],
					pages: [page, ...state.pages],
					activeSectionId: section.id,
					activePageId: page.id
				},
				undo: null
			};
		}
		case "rename-section": {
			const name = action.name.trim().slice(0, 80);
			const section = state.sections.find((item) => item.id === action.id);
			if (!section || !name || name === section.name) return {
				state,
				undo: null
			};
			return {
				state: {
					...state,
					sections: state.sections.map((item) => item.id === section.id ? {
						...item,
						name,
						updatedAt: stamp()
					} : item)
				},
				undo: null
			};
		}
		case "recolor-section": {
			const section = state.sections.find((item) => item.id === action.id);
			if (!section || section.color === action.color) return {
				state,
				undo: null
			};
			return {
				state: {
					...state,
					sections: state.sections.map((item) => item.id === section.id ? {
						...item,
						color: action.color
					} : item)
				},
				undo: null
			};
		}
		case "delete-section": {
			const section = state.sections.find((item) => item.id === action.id);
			if (!section) return {
				state,
				undo: null
			};
			const removedPages = state.pages.filter((page) => page.sectionId === section.id);
			const sections = state.sections.filter((item) => item.id !== section.id);
			const pages = state.pages.filter((page) => page.sectionId !== section.id);
			const siblings = sections.filter((item) => item.notebookId === section.notebookId);
			const wasActive = state.activeSectionId === section.id || removedPages.some((page) => page.id === state.activePageId);
			const neighbor = siblings[0];
			const neighborPages = neighbor ? pagesInSection({
				...state,
				pages
			}, neighbor.id) : [];
			return {
				state: {
					...state,
					sections,
					pages,
					activeSectionId: wasActive ? neighbor?.id ?? "" : state.activeSectionId,
					activePageId: wasActive ? neighborPages[0]?.id ?? null : state.activePageId
				},
				undo: {
					kind: "section",
					label: "Section deleted",
					section,
					pages: removedPages,
					activeNotebookId: state.activeNotebookId,
					activeSectionId: state.activeSectionId,
					activePageId: state.activePageId
				}
			};
		}
		case "select-page": {
			const page = state.pages.find((item) => item.id === action.id);
			if (!page) return {
				state,
				undo: null
			};
			const section = state.sections.find((item) => item.id === page.sectionId);
			if (!section) return {
				state,
				undo: null
			};
			return {
				state: {
					...state,
					activeNotebookId: section.notebookId,
					activeSectionId: section.id,
					activePageId: page.id
				},
				undo: null
			};
		}
		case "create-page": {
			const section = state.sections.find((item) => item.id === state.activeSectionId && item.notebookId === state.activeNotebookId);
			if (!section) return {
				state,
				undo: null
			};
			const created = stamp();
			const page = {
				id: action.id,
				sectionId: section.id,
				title: "",
				body: "",
				createdAt: created,
				updatedAt: created
			};
			return {
				state: {
					...state,
					pages: [page, ...state.pages],
					activePageId: page.id
				},
				undo: null
			};
		}
		case "update-page": {
			const page = state.pages.find((item) => item.id === action.id);
			if (!page) return {
				state,
				undo: null
			};
			const title = action.title !== void 0 ? action.title.slice(0, 500) : page.title;
			const body = action.body !== void 0 ? action.body.slice(0, 4e5) : page.body;
			if (title === page.title && body === page.body) return {
				state,
				undo: null
			};
			return {
				state: {
					...state,
					pages: state.pages.map((item) => item.id === page.id ? {
						...item,
						title,
						body,
						updatedAt: stamp()
					} : item)
				},
				undo: null
			};
		}
		case "delete-page": {
			const page = state.pages.find((item) => item.id === action.id);
			if (!page) return {
				state,
				undo: null
			};
			const list = pagesInSection(state, page.sectionId);
			const index = list.findIndex((item) => item.id === page.id);
			const neighbor = list[index + 1] ?? list[index - 1] ?? null;
			return {
				state: {
					...state,
					pages: state.pages.filter((item) => item.id !== page.id),
					activePageId: state.activePageId === page.id ? neighbor?.id ?? null : state.activePageId
				},
				undo: {
					kind: "page",
					label: "Page deleted",
					page,
					activeNotebookId: state.activeNotebookId,
					activeSectionId: state.activeSectionId,
					activePageId: state.activePageId
				}
			};
		}
		case "duplicate-page": {
			const page = state.pages.find((item) => item.id === action.id);
			if (!page) return {
				state,
				undo: null
			};
			const created = stamp();
			const copy = {
				...page,
				id: action.newId,
				title: page.title.trim() ? `Copy of ${page.title.trim()}` : "Copy of Untitled page",
				createdAt: created,
				updatedAt: created
			};
			return {
				state: {
					...state,
					pages: [copy, ...state.pages],
					activePageId: copy.id
				},
				undo: null
			};
		}
		case "move-page": {
			const page = state.pages.find((item) => item.id === action.id);
			const section = state.sections.find((item) => item.id === action.sectionId);
			if (!page || !section || page.sectionId === section.id) return {
				state,
				undo: null
			};
			return {
				state: {
					...state,
					pages: state.pages.map((item) => item.id === page.id ? {
						...item,
						sectionId: section.id,
						updatedAt: stamp()
					} : item),
					activeNotebookId: section.notebookId,
					activeSectionId: section.id,
					activePageId: page.id
				},
				undo: null
			};
		}
		case "set-view":
			if (state.viewMode === action.mode) return {
				state,
				undo: null
			};
			return {
				state: {
					...state,
					viewMode: action.mode
				},
				undo: null
			};
		default: return {
			state,
			undo: null
		};
	}
}
function restore(state, undo) {
	if (undo.kind === "page") {
		if (!state.sections.some((section) => section.id === undo.page.sectionId)) return state;
		const pages = state.pages.some((page) => page.id === undo.page.id) ? state.pages : [...state.pages, undo.page];
		return repair({
			...state,
			pages,
			activeNotebookId: undo.activeNotebookId,
			activeSectionId: undo.activeSectionId,
			activePageId: undo.activePageId
		});
	}
	if (undo.kind === "section") {
		if (!state.notebooks.some((notebook) => notebook.id === undo.section.notebookId)) return state;
		const sections = state.sections.some((section) => section.id === undo.section.id) ? state.sections : [...state.sections, undo.section];
		const known = new Set(state.pages.map((page) => page.id));
		const pages = [...state.pages, ...undo.pages.filter((page) => !known.has(page.id))];
		return repair({
			...state,
			sections,
			pages,
			activeNotebookId: undo.activeNotebookId,
			activeSectionId: undo.activeSectionId,
			activePageId: undo.activePageId
		});
	}
	const notebooks = state.notebooks.some((notebook) => notebook.id === undo.notebook.id) ? state.notebooks : [...state.notebooks, undo.notebook];
	const knownSections = new Set(state.sections.map((section) => section.id));
	const knownPages = new Set(state.pages.map((page) => page.id));
	return repair({
		...state,
		notebooks,
		sections: [...state.sections, ...undo.sections.filter((section) => !knownSections.has(section.id))],
		pages: [...state.pages, ...undo.pages.filter((page) => !knownPages.has(page.id))],
		activeNotebookId: undo.activeNotebookId,
		activeSectionId: undo.activeSectionId,
		activePageId: undo.activePageId
	});
}
function loadState() {
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
function saveState(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		return true;
	} catch {
		return false;
	}
}
function ConfirmDialog({ request, onCancel, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: request !== null,
		onOpenChange: (open) => {
			if (!open) onCancel();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, { className: "dialog-overlay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "dialog-content",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
					className: "dialog-title",
					children: request?.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
					className: "dialog-copy",
					children: request?.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dialog-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						className: "btn btn-quiet",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						className: request?.tone === "danger" ? "btn btn-danger" : "btn btn-accent",
						onClick: (event) => {
							event.preventDefault();
							onConfirm();
						},
						children: request?.confirmLabel ?? "Confirm"
					})]
				})
			]
		})] })
	});
}
var NotesContext = (0, import_react.createContext)(null);
function useNotes() {
	const value = (0, import_react.useContext)(NotesContext);
	if (!value) throw new Error("Notes are unavailable");
	return value;
}
function listPages(doc, query, searchAll) {
	if (!query.trim()) return pagesInSection(doc, doc.activeSectionId);
	return searchPages(doc, searchAll ? "all" : doc.activeNotebookId, query);
}
function NotesProvider({ children }) {
	const [store, setStore] = (0, import_react.useState)(() => ({
		doc: loadState() ?? createSeed(),
		undo: null
	}));
	const [query, setQuery] = (0, import_react.useState)("");
	const [searchAll, setSearchAll] = (0, import_react.useState)(false);
	const [mobilePane, setMobilePane] = (0, import_react.useState)("list");
	const [chromeHidden, setChromeHiddenState] = (0, import_react.useState)(false);
	const [focusTick, setFocusTick] = (0, import_react.useState)(0);
	const [renaming, setRenaming] = (0, import_react.useState)(null);
	const [saveError, setSaveError] = (0, import_react.useState)(false);
	const [helpOpen, setHelpOpen] = (0, import_react.useState)(false);
	const [confirmRequest, setConfirmRequest] = (0, import_react.useState)(null);
	const [wide, setWide] = (0, import_react.useState)(() => window.matchMedia("(min-width: 1024px)").matches);
	const searchRef = (0, import_react.useRef)(null);
	const docRef = (0, import_react.useRef)(store.doc);
	const queryRef = (0, import_react.useRef)(query);
	const searchAllRef = (0, import_react.useRef)(searchAll);
	const helpRef = (0, import_react.useRef)(helpOpen);
	const confirmRef = (0, import_react.useRef)(false);
	const settledRef = (0, import_react.useRef)(false);
	const renamingRef = (0, import_react.useRef)(renaming);
	docRef.current = store.doc;
	queryRef.current = query;
	searchAllRef.current = searchAll;
	helpRef.current = helpOpen;
	confirmRef.current = confirmRequest !== null;
	renamingRef.current = renaming;
	const mac = /Mac|iPhone|iPad/.test(navigator.userAgent);
	const modLabel = mac ? "⌘" : "Ctrl";
	const altLabel = mac ? "⌥" : "Alt";
	const dispatch = (0, import_react.useCallback)((action) => {
		setStore((prev) => {
			const result = apply(prev.doc, action);
			return {
				doc: result.state,
				undo: result.undo ?? prev.undo
			};
		});
	}, []);
	(0, import_react.useEffect)(() => {
		setSaveError(!saveState(store.doc));
	}, [store.doc]);
	(0, import_react.useEffect)(() => {
		if (!store.undo) return;
		const id = window.setTimeout(() => {
			setStore((prev) => prev.undo ? {
				...prev,
				undo: null
			} : prev);
		}, 6e3);
		return () => window.clearTimeout(id);
	}, [store.undo]);
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia("(min-width: 1024px)");
		const onChange = () => setWide(media.matches);
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, []);
	const confirm = (0, import_react.useCallback)((request) => {
		settledRef.current = false;
		return new Promise((resolve) => {
			setConfirmRequest({
				...request,
				resolve
			});
		});
	}, []);
	const closeConfirm = (0, import_react.useCallback)((ok) => {
		if (settledRef.current) return;
		settledRef.current = true;
		setConfirmRequest((current) => {
			current?.resolve(ok);
			return null;
		});
	}, []);
	const setChromeHidden = (0, import_react.useCallback)((value) => {
		setChromeHiddenState((prev) => typeof value === "function" ? value(prev) : value);
	}, []);
	const visiblePages = (0, import_react.useMemo)(() => listPages(store.doc, query, searchAll), [
		store.doc,
		query,
		searchAll
	]);
	const effectiveView = !wide && store.doc.viewMode === "split" ? "edit" : store.doc.viewMode;
	const openPage = (0, import_react.useCallback)((id) => {
		dispatch({
			type: "select-page",
			id
		});
		if (window.innerWidth < 768) setMobilePane("editor");
	}, [dispatch]);
	const createPage = (0, import_react.useCallback)(() => {
		const doc = docRef.current;
		if (!doc.sections.some((section) => section.id === doc.activeSectionId)) return;
		const id = crypto.randomUUID();
		dispatch({
			type: "create-page",
			id
		});
		setQuery("");
		setRenaming(null);
		setChromeHiddenState(false);
		setMobilePane("editor");
		setFocusTick((tick) => tick + 1);
	}, [dispatch]);
	const createSection = (0, import_react.useCallback)(() => {
		const id = crypto.randomUUID();
		const pageId = crypto.randomUUID();
		dispatch({
			type: "create-section",
			id,
			pageId
		});
		setQuery("");
		setRenaming({
			kind: "section",
			id
		});
		setChromeHiddenState(false);
		setMobilePane("list");
	}, [dispatch]);
	const createNotebook = (0, import_react.useCallback)(() => {
		const id = crypto.randomUUID();
		dispatch({
			type: "create-notebook",
			id,
			sectionId: crypto.randomUUID(),
			pageId: crypto.randomUUID()
		});
		setQuery("");
		setRenaming({
			kind: "notebook",
			id
		});
		setChromeHiddenState(false);
		setMobilePane("list");
	}, [dispatch]);
	const deletePage = (0, import_react.useCallback)(async (id) => {
		const page = docRef.current.pages.find((item) => item.id === id);
		if (!page) return;
		const title = page.title.trim() || "Untitled page";
		if (!await confirm({
			title: `Delete “${title}”?`,
			description: "The page leaves this notebook. You can undo it for a few seconds.",
			confirmLabel: "Delete page",
			tone: "danger"
		})) return;
		dispatch({
			type: "delete-page",
			id
		});
	}, [confirm, dispatch]);
	const deleteSection = (0, import_react.useCallback)(async (id) => {
		const section = docRef.current.sections.find((item) => item.id === id);
		if (!section) return;
		const count = docRef.current.pages.filter((page) => page.sectionId === id).length;
		if (!await confirm({
			title: `Delete “${section.name}”?`,
			description: count === 0 ? "This section is empty." : `This also deletes ${count} ${count === 1 ? "page" : "pages"}. You can undo it for a few seconds.`,
			confirmLabel: "Delete section",
			tone: "danger"
		})) return;
		dispatch({
			type: "delete-section",
			id
		});
		setRenaming((current) => current?.id === id ? null : current);
	}, [confirm, dispatch]);
	const deleteNotebook = (0, import_react.useCallback)(async (id) => {
		if (docRef.current.notebooks.length < 2) return;
		const notebook = docRef.current.notebooks.find((item) => item.id === id);
		if (!notebook) return;
		if (!await confirm({
			title: `Delete “${notebook.name}”?`,
			description: "Sections and pages inside it are deleted too. You can undo it for a few seconds.",
			confirmLabel: "Delete notebook",
			tone: "danger"
		})) return;
		dispatch({
			type: "delete-notebook",
			id
		});
		setRenaming((current) => current?.id === id ? null : current);
	}, [confirm, dispatch]);
	const selectNotebook = (0, import_react.useCallback)((id) => {
		dispatch({
			type: "select-notebook",
			id
		});
		setQuery("");
		setMobilePane("list");
	}, [dispatch]);
	const selectSection = (0, import_react.useCallback)((id) => {
		dispatch({
			type: "select-section",
			id
		});
		setQuery("");
	}, [dispatch]);
	const cycleView = (0, import_react.useCallback)(() => {
		const doc = docRef.current;
		const isWide = window.matchMedia("(min-width: 1024px)").matches;
		const order = isWide ? [
			"edit",
			"split",
			"preview"
		] : ["edit", "preview"];
		const current = !isWide && doc.viewMode === "split" ? "edit" : doc.viewMode;
		const next = order[(order.indexOf(current) + 1) % order.length];
		dispatch({
			type: "set-view",
			mode: next
		});
	}, [dispatch]);
	const moveSelection = (0, import_react.useCallback)((delta) => {
		const pages = listPages(docRef.current, queryRef.current, searchAllRef.current);
		if (pages.length === 0) return;
		const index = pages.findIndex((page) => page.id === docRef.current.activePageId);
		const start = index < 0 ? delta > 0 ? 0 : pages.length - 1 : index + delta;
		const next = pages[Math.min(pages.length - 1, Math.max(0, start))];
		if (next) dispatch({
			type: "select-page",
			id: next.id
		});
	}, [dispatch]);
	const focusPageButton = (0, import_react.useCallback)((id) => {
		window.requestAnimationFrame(() => {
			document.getElementById(`page-${id}`)?.focus();
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (confirmRef.current || helpRef.current) return;
			const target = event.target;
			const typing = target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
			const mod = event.metaKey || event.ctrlKey;
			if (event.key === "Escape") {
				if (renamingRef.current) return;
				if (document.activeElement === searchRef.current) {
					if (queryRef.current) setQuery("");
					else searchRef.current?.blur();
					return;
				}
				if (typing) {
					document.activeElement?.blur();
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
				if (id) deletePage(id);
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
			if (!typing && document.activeElement === searchRef.current && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
				event.preventDefault();
				const pages = listPages(docRef.current, queryRef.current, searchAllRef.current);
				if (pages.length === 0) return;
				const index = pages.findIndex((page) => page.id === docRef.current.activePageId);
				const next = pages[event.key === "ArrowDown" ? index < 0 ? 0 : Math.min(pages.length - 1, index + 1) : Math.max(0, index < 0 ? 0 : index - 1)];
				if (!next) return;
				dispatch({
					type: "select-page",
					id: next.id
				});
				window.requestAnimationFrame(() => document.getElementById(`page-${next.id}`)?.focus());
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		createNotebook,
		createPage,
		createSection,
		cycleView,
		deletePage,
		dispatch,
		moveSelection
	]);
	const api = (0, import_react.useMemo)(() => ({
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
		renameNotebook: (id, name) => dispatch({
			type: "rename-notebook",
			id,
			name
		}),
		deleteNotebook,
		selectSection,
		createSection,
		renameSection: (id, name) => dispatch({
			type: "rename-section",
			id,
			name
		}),
		recolorSection: (id, color) => dispatch({
			type: "recolor-section",
			id,
			color
		}),
		deleteSection,
		openPage,
		selectPage: (id) => dispatch({
			type: "select-page",
			id
		}),
		createPage,
		updatePage: (id, patch) => dispatch({
			type: "update-page",
			id,
			...patch
		}),
		deletePage,
		duplicatePage: (id) => {
			dispatch({
				type: "duplicate-page",
				id,
				newId: crypto.randomUUID()
			});
			setChromeHiddenState(false);
			setMobilePane("editor");
		},
		movePage: (id, sectionId) => dispatch({
			type: "move-page",
			id,
			sectionId
		}),
		setView: (mode) => dispatch({
			type: "set-view",
			mode
		}),
		cycleView,
		moveSelection,
		focusPageButton,
		confirm,
		performUndo: () => {
			setStore((prev) => prev.undo ? {
				doc: restore(prev.doc, prev.undo),
				undo: null
			} : prev);
		},
		dismissUndo: () => setStore((prev) => ({
			...prev,
			undo: null
		})),
		helpOpen,
		setHelpOpen
	}), [
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
		dispatch
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NotesContext.Provider, {
		value: api,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			request: confirmRequest,
			onCancel: () => closeConfirm(false),
			onConfirm: () => closeConfirm(true)
		})]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("mark", className),
		"aria-hidden": "true",
		children: "N"
	});
}
function IconButton({ label, className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		title: label,
		className: cn("icon-btn press", className),
		...props,
		children
	});
}
function RenameField({ initial, label, className, onCommit, onCancel }) {
	const ref = (0, import_react.useRef)(null);
	const cancelRef = (0, import_react.useRef)(false);
	const [value, setValue] = (0, import_react.useState)(initial);
	(0, import_react.useEffect)(() => {
		ref.current?.focus();
		ref.current?.select();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref,
		"aria-label": label,
		value,
		maxLength: 80,
		className: cn("rename-field", className),
		onChange: (event) => setValue(event.target.value),
		onBlur: () => {
			if (cancelRef.current) return;
			onCommit(value);
		},
		onKeyDown: (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				onCommit(value);
			}
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation();
				cancelRef.current = true;
				onCancel();
			}
		}
	});
}
var VIEWS = [
	{
		mode: "edit",
		label: "Edit",
		icon: PenLine
	},
	{
		mode: "split",
		label: "Split",
		icon: Columns2
	},
	{
		mode: "preview",
		label: "Preview",
		icon: Eye
	}
];
function EditorPane() {
	const api = useNotes();
	const { doc } = api;
	const page = doc.pages.find((item) => item.id === doc.activePageId) ?? null;
	const section = doc.sections.find((item) => item.id === page?.sectionId);
	const notebook = doc.notebooks.find((item) => item.id === (section?.notebookId ?? doc.activeNotebookId));
	const sections = doc.sections.filter((item) => item.notebookId === notebook?.id);
	const titleRef = (0, import_react.useRef)(null);
	const areaRef = (0, import_react.useRef)(null);
	const mode = api.effectiveView;
	const showEditor = mode !== "preview";
	const showPreview = mode === "preview" || mode === "split" && api.wide;
	const hiddenOnMobile = api.mobilePane === "list" && !api.chromeHidden;
	(0, import_react.useEffect)(() => {
		if (api.focusTick === 0) return;
		titleRef.current?.focus();
	}, [api.focusTick]);
	const commit = (result) => {
		if (!page) return;
		const el = areaRef.current;
		api.updatePage(page.id, { body: result.value });
		window.requestAnimationFrame(() => {
			el?.focus();
			el?.setSelectionRange(result.selectionStart, result.selectionEnd);
		});
	};
	const run = (edit) => {
		const el = areaRef.current;
		if (!el || !page) return;
		commit(edit(el.value, el.selectionStart, el.selectionEnd));
	};
	const showPages = () => {
		api.setChromeHidden(false);
		api.setMobilePane("list");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: hiddenOnMobile ? "editor-pane is-hidden-mobile" : "editor-pane",
		"aria-label": "Page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "editor-toolbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Pages",
						className: "mobile-back",
						onClick: showPages,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "format-bar",
						role: "toolbar",
						"aria-label": "Formatting",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Bold",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => wrapSelection(v, s, e, "**", "**")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Italic",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => wrapSelection(v, s, e, "*", "*")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Italic, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Strikethrough",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => wrapSelection(v, s, e, "~~", "~~")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strikethrough, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "tool-sep" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Heading",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => toggleLinePrefix(v, s, e, "# ")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading1, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Subheading",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => toggleLinePrefix(v, s, e, "## ")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading2, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Bulleted list",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => toggleLinePrefix(v, s, e, "- ")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Numbered list",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => toggleLinePrefix(v, s, e, "1. ")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListOrdered, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Task list",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => toggleLinePrefix(v, s, e, "- [ ] ")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListTodo, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "tool-sep" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Quote",
								disabled: !showEditor,
								onClick: () => run((v, s, e) => toggleLinePrefix(v, s, e, "> ")),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Code",
								disabled: !showEditor,
								onClick: () => run(insertCode),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Link",
								disabled: !showEditor,
								onClick: () => run(insertLink),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "toolbar-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "view-switch",
								role: "radiogroup",
								"aria-label": "Editor view",
								children: VIEWS.map((view) => {
									const Icon = view.icon;
									const checked = mode === view.mode || view.mode === "edit" && mode === "split" && !api.wide;
									if (view.mode === "split") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										role: "radio",
										"aria-checked": doc.viewMode === "split",
										"aria-label": view.label,
										title: view.label,
										className: "view-btn split-only press",
										onClick: () => api.setView("split"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
									}, view.mode);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										role: "radio",
										"aria-checked": view.mode === "preview" ? mode === "preview" : checked,
										"aria-label": view.label,
										title: view.label,
										className: checked && view.mode !== "preview" ? "view-btn press is-on" : mode === "preview" && view.mode === "preview" ? "view-btn press is-on" : "view-btn press",
										onClick: () => api.setView(view.mode),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
									}, view.mode);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								className: "desktop-only",
								label: api.chromeHidden ? "Show pages" : "Hide sidebar",
								onClick: () => api.setChromeHidden((hidden) => !hidden),
								children: api.chromeHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "size-4" })
							}),
							page ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								className: "icon-btn press",
								"aria-label": "Page actions",
								title: "Page actions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								className: "menu-content",
								align: "end",
								sideOffset: 6,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										className: "menu-item",
										onSelect: () => api.duplicatePage(page.id),
										children: "Duplicate page"
									}),
									sections.filter((item) => item.id !== page.sectionId).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										className: "menu-item",
										onSelect: () => api.movePage(page.id, item.id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "dot",
												"data-color": item.color
											}),
											"Move to ",
											item.name
										]
									}, item.id)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "menu-sep" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										className: "menu-item menu-danger",
										onSelect: () => void api.deletePage(page.id),
										children: "Delete page"
									})
								]
							}) })] }) : null
						]
					})
				]
			}),
			page && section && notebook ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "editor-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: mode === "split" && api.wide ? "paper paper-wide" : "paper",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "crumbs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: showPages,
										children: notebook.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: showPages,
										children: section.name
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: titleRef,
								className: "page-title",
								value: page.title,
								"aria-label": "Page title",
								placeholder: "Untitled page",
								onChange: (event) => api.updatePage(page.id, { title: event.target.value }),
								onKeyDown: (event) => {
									if (event.key === "Enter") {
										event.preventDefault();
										areaRef.current?.focus();
									}
								}
							}, `${page.id}-title`),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "edited-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", {
										dateTime: new Date(page.updatedAt).toISOString(),
										title: editedExact(page.updatedAt),
										children: ["Edited ", editedLabel(page.updatedAt).toLowerCase() === "just now" ? "just now" : editedLabel(page.updatedAt)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: api.saveError ? "Could not save on this device" : "Saved on this device" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: mode === "split" && api.wide ? "writing writing-split" : "writing",
						children: [showEditor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							ref: areaRef,
							className: "writing-field",
							value: page.body,
							"aria-label": "Page body",
							placeholder: "Start writing in Markdown…",
							spellCheck: true,
							onChange: (event) => api.updatePage(page.id, { body: event.target.value }),
							onKeyDown: (event) => {
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
							}
						}, page.id) : null, showPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: showEditor ? "preview-pane preview-split" : "preview-pane",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownView, {
								source: page.body,
								onToggleTask: (raw) => api.updatePage(page.id, { body: toggleTask(page.body, raw) })
							})
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "editor-foot",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular",
							children: [wordCount(page.body), " words"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Markdown" })]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "editor-empty",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty-title",
						children: "No page open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty-copy",
						children: section ? `Add a page to ${section.name}.` : "Add a section, then a page, and start writing."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-accent",
						onClick: section ? api.createPage : api.createSection,
						children: section ? "New page" : "New section"
					})
				]
			}),
			page ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "sr-only",
				children: ["Editing ", pageTitle(page)]
			}) : null
		]
	});
}
function HelpDialog() {
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
		["This list", "?"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: api.helpOpen,
		onOpenChange: api.setHelpOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "dialog-overlay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "dialog-content",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dialog-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "dialog-title",
						children: "Keyboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						className: "icon-btn press",
						"aria-label": "Close shortcuts",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "dialog-copy",
					children: "These work while you write. New page, search, and delete are also in the sidebar."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "shortcut-list",
					children: rows.map(([label, keys]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: keys })] }, label))
				})
			]
		})] })
	});
}
function NotebookRail() {
	const { doc, chromeHidden, selectNotebook, createNotebook } = useNotes();
	if (chromeHidden) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "notebook-rail",
		"aria-label": "Notebooks",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "rail-mark" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rail-list",
				children: doc.notebooks.map((notebook) => {
					const active = notebook.id === doc.activeNotebookId;
					const letter = notebook.name.trim().charAt(0).toUpperCase() || "N";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rail-btn press",
						"aria-label": notebook.name,
						title: notebook.name,
						"aria-current": active ? "true" : void 0,
						onClick: () => selectNotebook(notebook.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "notebook-cover",
							"data-color": notebook.color,
							"data-active": active ? "true" : "false",
							children: letter
						})
					}, notebook.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "rail-btn press rail-add",
				onClick: createNotebook,
				"aria-label": "New notebook",
				title: "New notebook",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
			})
		]
	});
}
var COLOR_LABEL = {
	plum: "Plum",
	slate: "Slate",
	sage: "Sage",
	clay: "Clay",
	ink: "Ink"
};
function PageSidebar() {
	const api = useNotes();
	const { doc } = api;
	const notebook = doc.notebooks.find((item) => item.id === doc.activeNotebookId) ?? doc.notebooks[0];
	const sections = doc.sections.filter((section) => section.notebookId === notebook?.id);
	const activeSection = sections.find((section) => section.id === doc.activeSectionId) ?? null;
	const searching = api.query.trim().length > 0;
	const pages = api.visiblePages;
	(0, import_react.useEffect)(() => {
		if (!doc.activePageId) return;
		document.getElementById(`page-${doc.activePageId}`)?.scrollIntoView({ block: "nearest" });
	}, [doc.activePageId, searching]);
	if (api.chromeHidden || !notebook) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: api.mobilePane === "editor" ? "page-sidebar is-hidden-mobile" : "page-sidebar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sidebar-brand md-only-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "OneNote" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sidebar-head",
				children: api.renaming?.kind === "notebook" && api.renaming.id === notebook.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenameField, {
					initial: notebook.name,
					label: "Notebook name",
					className: "rename-wide",
					onCommit: (name) => {
						api.renameNotebook(notebook.id, name);
						api.setRenaming(null);
					},
					onCancel: () => api.setRenaming(null)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
					className: "notebook-trigger press",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: notebook.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					className: "menu-content",
					align: "start",
					sideOffset: 6,
					children: [
						doc.notebooks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							className: "menu-item",
							onSelect: () => api.selectNotebook(item.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "dot",
									"data-color": item.color
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: item.name
								}),
								item.id === notebook.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "menu-meta",
									children: "Current"
								}) : null
							]
						}, item.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "menu-sep" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							className: "menu-item",
							onSelect: api.createNotebook,
							children: "New notebook"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							className: "menu-item",
							onSelect: () => api.setRenaming({
								kind: "notebook",
								id: notebook.id
							}),
							children: "Rename notebook"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							className: "menu-item menu-danger",
							disabled: doc.notebooks.length < 2,
							onSelect: () => void api.deleteNotebook(notebook.id),
							children: "Delete notebook"
						})
					]
				}) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "search-wrap",
				role: "search",
				onSubmit: (event) => {
					event.preventDefault();
					const target = pages.find((page) => page.id === doc.activePageId) ?? pages[0];
					if (target) api.openPage(target.id);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "search-icon" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: api.searchRef,
						value: api.query,
						onChange: (event) => api.setQuery(event.target.value),
						className: "search-input",
						placeholder: "Search pages",
						"aria-label": "Search pages",
						autoComplete: "off",
						autoCorrect: "off",
						spellCheck: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("kbd", {
						className: "search-kbd",
						children: [api.modLabel, "K"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-row",
				role: "tablist",
				"aria-label": "Sections",
				children: [
					sections.map((section) => {
						const active = section.id === doc.activeSectionId && !searching;
						if (api.renaming?.kind === "section" && api.renaming.id === section.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenameField, {
							initial: section.name,
							label: "Section name",
							className: "section-rename",
							onCommit: (name) => {
								api.renameSection(section.id, name);
								api.setRenaming(null);
							},
							onCancel: () => api.setRenaming(null)
						}, section.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							id: `section-${section.id}`,
							className: "section-tab press",
							"data-color": section.color,
							"data-active": active ? "true" : "false",
							"aria-selected": active,
							onClick: () => api.selectSection(section.id),
							children: section.name
						}, section.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "New section",
						onClick: api.createSection,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					}),
					activeSection ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						className: "icon-btn press",
						"aria-label": "Section actions",
						title: "Section actions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						className: "menu-content",
						align: "end",
						sideOffset: 6,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								className: "menu-item",
								onSelect: () => api.setRenaming({
									kind: "section",
									id: activeSection.id
								}),
								children: "Rename section"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "swatch-row",
								role: "group",
								"aria-label": "Section color",
								children: SECTION_COLORS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "swatch",
									"data-color": color,
									"aria-label": COLOR_LABEL[color],
									"aria-pressed": activeSection.color === color,
									onClick: () => api.recolorSection(activeSection.id, color)
								}, color))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "menu-sep" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								className: "menu-item menu-danger",
								onSelect: () => void api.deleteSection(activeSection.id),
								children: "Delete section"
							})
						]
					}) })] }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "list-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: searching ? "Results" : "Pages" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "list-count",
					"aria-live": "polite",
					children: [
						pages.length,
						" ",
						pages.length === 1 ? "page" : "pages",
						searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-link",
							"aria-pressed": api.searchAll,
							onClick: () => api.setSearchAll(!api.searchAll),
							children: api.searchAll ? "All notebooks" : "This notebook"
						}) : null
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "text-action press",
					onClick: api.createPage,
					disabled: sections.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New page"]
				})]
			}),
			sections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "empty-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty-title",
						children: "No sections yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty-copy",
						children: "A section holds the pages in this notebook."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-accent",
						onClick: api.createSection,
						children: "New section"
					})
				]
			}) : pages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "empty-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty-title",
						children: searching ? "No matches" : "No pages yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty-copy",
						children: searching ? `Nothing ${api.searchAll ? "in your notebooks" : `in ${notebook.name}`} contains “${api.query.trim()}”.` : "Create a page in this section and start writing."
					}),
					!searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-accent",
						onClick: api.createPage,
						children: "New page"
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "page-list scroll-area",
				"aria-label": searching ? "Search results" : "Pages",
				children: pages.map((page, index) => {
					const active = page.id === doc.activePageId;
					const section = doc.sections.find((item) => item.id === page.sectionId);
					const owner = section ? doc.notebooks.find((item) => item.id === section.notebookId) : void 0;
					const title = pageTitle(page);
					const line = searching ? previewLine(page.body, api.query) : previewLine(page.body);
					const inList = pages.some((item) => item.id === doc.activePageId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: active ? "page-row page-row-active" : "page-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							id: `page-${page.id}`,
							"data-page-select": "",
							className: "page-select",
							"aria-current": active ? "page" : void 0,
							tabIndex: active || !inList && index === 0 ? 0 : -1,
							onClick: () => api.openPage(page.id),
							onKeyDown: (event) => {
								if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
									event.preventDefault();
									const next = event.key === "Home" ? pages[0] : event.key === "End" ? pages[pages.length - 1] : pages[index + (event.key === "ArrowDown" ? 1 : -1)];
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
									api.deletePage(page.id);
								}
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "page-name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
										text: title,
										query: api.query
									})
								}),
								searching && section ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "page-where",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "dot",
											"data-color": section.color
										}),
										section.name,
										api.searchAll && owner ? ` · ${owner.name}` : ""
									]
								}) : null,
								line ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "page-snippet",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
										text: line,
										query: searching ? api.query : ""
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "page-snippet",
									children: "Empty page"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									dateTime: new Date(page.updatedAt).toISOString(),
									title: editedExact(page.updatedAt),
									children: editedLabel(page.updatedAt)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "page-delete press",
							"aria-label": `Delete ${title}`,
							onClick: () => void api.deletePage(page.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}, page.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "shortcut-btn press",
				onClick: () => api.setHelpOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "size-4" }), "Keyboard shortcuts"]
			})
		]
	});
}
function NotesApp() {
	const api = useNotes();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "desk",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "desk-columns",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookRail, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSidebar, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorPane, {})
				]
			}),
			api.undo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "undo-bar",
				role: "status",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: api.undo.label }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-accent",
						onClick: api.performUndo,
						children: "Undo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-quiet",
						onClick: api.dismissUndo,
						children: "Dismiss"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpDialog, {})
		]
	});
}
function Home() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "boot",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening notebook…" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesApp, {}) });
}
//#endregion
export { Home as component };
