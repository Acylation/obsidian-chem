import { MarkdownRenderChild, MarkdownPostProcessorContext } from 'obsidian';
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
			const img = div.createEl('img') as HTMLImageElement;
			gDrawer.draw(
				rows[0], // handle spaces in front of the string
				img,
				document.body.hasClass('theme-dark') &&
					!document.body.hasClass('theme-light')
					? this.settings.darkTheme
					: this.settings.lightTheme
			);
		} else {
			const table = this.el.createDiv({ cls: 'chem-table' });
			table.style.gridTemplateColumns = `repeat(auto-fill, minmax(${
				this.settings.options.width?.toString() ?? '200'
			}px, 1fr)`;

			for (let i = 0; i < rows.length; i++) {
				const cell = table.createDiv({ cls: 'chem-table-cell' });
				const imgcell = cell.createEl('img') as HTMLImageElement;
				gDrawer.draw(
					rows[i], // handle spaces in front of the string
					imgcell,
					document.body.hasClass('theme-dark') &&
						!document.body.hasClass('theme-light')
						? this.settings.darkTheme
						: this.settings.lightTheme
				);
			}
		}
	}

	async onload() {
		this.render();
	}

	onunload() {
		removeBlock(this); // remove from global block list
	}
}
