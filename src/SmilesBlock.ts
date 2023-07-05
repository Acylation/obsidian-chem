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
			.filter((row) => row.length > 0);

		for (let i = 0; i < rows.length; i++) {
			const img = this.el.createEl('img') as HTMLImageElement;
			gDrawer.draw(
				rows[i].trim(), // handle spaces in front of the string
				img,
				document.body.hasClass('theme-dark') &&
					!document.body.hasClass('theme-light')
					? this.settings.darkTheme
					: this.settings.lightTheme
			);
		}
	}

	async onload() {
		this.render();
	}

	onunload() {
		removeBlock(this); // remove from global block list
	}
}
