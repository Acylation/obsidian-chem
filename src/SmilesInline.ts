/**
	Adapted from https://github.com/blacksmithgu/obsidian-dataview/blob/master/src/ui/lp-render.ts
	Refered to https://github.com/blacksmithgu/obsidian-dataview/pull/1247
	More upstream from https://github.com/artisticat1/obsidian-latex-suite/blob/main/src/editor_extensions/conceal.ts
*/

import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from '@codemirror/view';
import { EditorSelection, Range } from '@codemirror/state';
import { syntaxTree, tokenClassNodeProp } from '@codemirror/language';
import { SyntaxNode } from '@lezer/common';

import { gRenderCore } from './global/chemCore';
import { ChemPluginSettings } from './settings/base';
import { getCurrentTheme } from './lib/themes/getCurrentTheme';

import { Component, editorInfoField, editorLivePreviewField } from 'obsidian';

function selectionAndRangeOverlap(
	selection: EditorSelection,
	rangeFrom: number,
	rangeTo: number
) {
	for (const range of selection.ranges) {
		if (range.from <= rangeTo && range.to >= rangeFrom) {
			return true;
		}
	}
	return false;
}

class InlineWidget extends WidgetType {
	constructor(
		readonly source: string,
		private el: HTMLElement,
		private view: EditorView
	) {
		super();
	}

	eq(other: InlineWidget): boolean {
		return other.source === this.source ? true : false;
	}

	toDOM(): HTMLElement {
		return this.el;
	}

	/* Make queries only editable when shift is pressed (or navigated inside with the keyboard
	 * or the mouse is placed at the end, but that is always possible regardless of this method).
	 * Mostly useful for links, and makes results selectable.
	 * If the widgets should always be expandable, make this always return false.
	 */
	ignoreEvent(event: MouseEvent | Event): boolean {
		// instanceof check does not work in pop-out windows, so check it like this
		if (event.type === 'mousedown') {
			const currentPos = this.view.posAtCoords({
				x: (event as MouseEvent).x,
				y: (event as MouseEvent).y,
			});
			if ((event as MouseEvent).shiftKey) {
				// Set the cursor after the element so that it doesn't select starting from the last cursor position.
				if (currentPos) {
					const { editor } = this.view.state.field(editorInfoField);
					if (editor) {
						editor.setCursor(editor.offsetToPos(currentPos));
					}
				}
				return false;
			}
		}
		return true;
	}
}

// TODO: update these on settings change refer to main.ts
export function inlinePlugin(settings: ChemPluginSettings) {
	const renderCell = async (
		source: string,
		target: HTMLElement,
		theme?: string
	) => {
		const svg = await gRenderCore.draw(source, theme);
		target.appendChild(svg);

		if (settings.commonOptions.scale == 0)
			svg.style.width = `${
				settings.commonOptions.unifiedWidth?.toString() ?? 300
			}px`;
		return svg;
	};

	return ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;
			component: Component;

			constructor(view: EditorView) {
				this.component = new Component();
				this.component.load();
				this.decorations = this.inlineRender(view) ?? Decoration.none;
			}

			update(update: ViewUpdate) {
				// only activate in LP and not source mode
				if (!update.state.field(editorLivePreviewField)) {
					this.decorations = Decoration.none;
					return;
				}
				if (update.docChanged) {
					this.decorations = this.decorations.map(update.changes);
					this.updateTree(update.view);
				} else if (update.selectionSet) {
					this.updateTree(update.view);
				} else if (update.viewportChanged /*|| update.selectionSet*/) {
					this.decorations =
						this.inlineRender(update.view) ?? Decoration.none;
				}
			}

			updateTree(view: EditorView) {
				for (const { from, to } of view.visibleRanges) {
					syntaxTree(view.state).iterate({
						from,
						to,
						enter: ({ node }) => {
							const { render, isQuery } = this.renderNode(
								view,
								node
							);
							if (!render && isQuery) {
								this.removeDeco(node);
								return;
							} else if (!render) {
								return;
							} else if (render) {
								this.addDeco(node, view);
							}
						},
					});
				}
			}

			removeDeco(node: SyntaxNode) {
				this.decorations.between(
					node.from - 1,
					node.to + 1,
					(from, to, value) => {
						this.decorations = this.decorations.update({
							filterFrom: from,
							filterTo: to,
							filter: (from, to, value) => false,
						});
					}
				);
			}

			addDeco(node: SyntaxNode, view: EditorView) {
				const from = node.from - 1;
				const to = node.to + 1;
				let exists = false;
				this.decorations.between(from, to, (from, to, value) => {
					exists = true;
				});
				if (!exists) {
					/**
					 * In a note embedded in a Canvas, app.workspace.getActiveFile() returns
					 * the canvas file, not the note file. On the other hand,
					 * view.state.field(editorInfoField).file returns the note file itself,
					 * which is more suitable here.
					 */
					const currentFile = view.state.field(editorInfoField).file;
					if (!currentFile) return;
					const newDeco = this.renderWidget(node, view)?.value;
					if (newDeco) {
						this.decorations = this.decorations.update({
							add: [{ from: from, to: to, value: newDeco }],
						});
					}
				}
			}

			// checks whether a node should get rendered/unrendered
			renderNode(view: EditorView, node: SyntaxNode) {
				const type = node.type;
				const tokenProps = type.prop<string>(tokenClassNodeProp);
				const props = new Set(tokenProps?.split(' '));
				if (props.has('inline-code') && !props.has('formatting')) {
					const start = node.from;
					const end = node.to;
					const selection = view.state.selection;
					if (
						selectionAndRangeOverlap(selection, start - 1, end + 1)
					) {
						if (this.isInlineSmiles(view, start, end)) {
							return { render: false, isQuery: true };
						} else {
							return { render: false, isQuery: false };
						}
					} else if (this.isInlineSmiles(view, start, end)) {
						return { render: true, isQuery: true };
					}
				}
				return { render: false, isQuery: false };
			}

			isInlineSmiles(view: EditorView, start: number, end: number) {
				if (settings.inlineSmilesPrefix.length > 0) {
					const text = view.state.doc.sliceString(start, end);
					return text.startsWith(settings.inlineSmilesPrefix);
				} else return false;
			}

			inlineRender(view: EditorView) {
				const currentFile = view.state.field(editorInfoField).file;
				if (!currentFile) return;

				const widgets: Range<Decoration>[] = [];

				for (const { from, to } of view.visibleRanges) {
					syntaxTree(view.state).iterate({
						from,
						to,
						enter: ({ node }) => {
							if (!this.renderNode(view, node).render) return;
							const widget = this.renderWidget(node, view);
							if (widget) {
								widgets.push(widget);
							}
						},
					});
				}
				return Decoration.set(widgets, true);
			}

			renderWidget(node: SyntaxNode, view: EditorView) {
				// contains the position of inline code
				const start = node.from;
				const end = node.to;
				// safety net against unclosed inline code
				if (view.state.doc.sliceString(end, end + 1) === '\n') {
					return;
				}
				const text = view.state.doc.sliceString(start, end);
				const el = createSpan({
					cls: ['smiles', 'chem-cell-inline', 'chem-cell'],
				});

				/* If the query result is predefined text (e.g. in the case of errors), set innerText to it.
				 * Otherwise, pass on an empty element and fill it in later.
				 * This is necessary because {@link InlineWidget.toDOM} is synchronous but some rendering
				 * asynchronous.
				 */
				let code = '';
				if (
					settings.inlineSmiles &&
					text.startsWith(settings.inlineSmilesPrefix)
				) {
					code = text
						.substring(settings.inlineSmilesPrefix.length)
						.trim();

					renderCell(code, el.createDiv(), getCurrentTheme(settings));
				}

				return Decoration.replace({
					widget: new InlineWidget(code, el, view),
					inclusive: false,
					block: false,
				}).range(start - 1, end + 1);
			}

			destroy() {
				this.component.unload();
			}
		},
		{ decorations: (v) => v.decorations }
	);
}
