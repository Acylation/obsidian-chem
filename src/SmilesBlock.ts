import { MarkdownRenderChild, MarkdownPostProcessorContext } from 'obsidian';
import SmilesDrawer from 'smiles-drawer';
import { gDrawer } from './drawer';
import { ChemPluginSettings } from './settings/base';
import { addBlock, removeBlock } from './blocks';

/**
 * Refer to plugin abcjs
 * This class abstraction is needed to support load/unload hooks
 * "If your post processor requires lifecycle management, for example, to clear an interval, kill a subprocess, etc when this element is removed from the app..."
 * https://marcus.se.net/obsidian-plugin-docs/reference/typescript/interfaces/MarkdownPostProcessorContext#addchild
 */
export class SmilesBlock extends MarkdownRenderChild {
	constructor(
		private readonly el: HTMLElement,
		private readonly markdownSource: string,
		private readonly context: MarkdownPostProcessorContext,
		private readonly settings: ChemPluginSettings
	) {
		super(el); // important
		addBlock(this);
	}

	render() {
		//TODO: rendering animation
		//TODO: catching render error

		this.el.empty();

		const rows = this.markdownSource
			.split('\n')
			.filter((row) => row.length > 0)
			.map((row) => row.trim());

		if (rows.length == 1) {
			const div = this.el.createDiv({ cls: 'chem-table-cell' });
			const svg = div.createSvg('svg');
			svg.style.userSelect = `none`;
			SmilesDrawer.parse(rows[0], (tree: any) => {
				gDrawer.draw(
					tree,
					svg,
					document.body.hasClass('theme-dark') &&
						!document.body.hasClass('theme-light')
						? this.settings.darkTheme
						: this.settings.lightTheme
				);
			});
		} else {
			const table = this.el.createDiv({ cls: 'chem-table' });

			rows.forEach((row) => {
				const cell = table.createDiv({ cls: 'chem-table-cell' });
				cell.style.userSelect = `none`;
				const svgcell = cell.createSvg('svg');
				SmilesDrawer.parse(row, (tree: any) => {
					gDrawer.draw(
						tree,
						svgcell,
						document.body.hasClass('theme-dark') &&
							!document.body.hasClass('theme-light')
							? this.settings.darkTheme
							: this.settings.lightTheme
					);
				});
			});

			table.style.gridTemplateColumns = `repeat(auto-fill, minmax(${
				this.settings.options.width?.toString() ?? '200'
			}px, 1fr)`;

			console.log(table.childElementCount);
		}
	}

	async onload() {
		this.render();
	}

	onunload() {
		removeBlock(this); // remove from global block list
	}
}
