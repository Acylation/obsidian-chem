import { ChemPluginSettings } from '../settings/base';

import SmilesDrawer from 'smiles-drawer';
import { gDrawer } from '../drawer';

/**
 * Refer to plugin abcjs
 * This class abstraction is needed to support load/unload hooks
 * "If your post processor requires lifecycle management, for example, to clear an interval, kill a subprocess, etc when this element is removed from the app..."
 * https://marcus.se.net/obsidian-plugin-docs/reference/typescript/interfaces/MarkdownPostProcessorContext#addchild
 */
export class LivePreview {
	container: HTMLDivElement;
	lightCard: HTMLDivElement;
	darkCard: HTMLDivElement;
	settings: ChemPluginSettings;

	constructor(
		private readonly el: HTMLElement,
		private readonly argSettings: ChemPluginSettings
	) {
		this.container = this.el.createEl('div');
		this.container.style.display = `flex`;

		this.lightCard = this.container.createEl('div', {
			cls: 'chemcard theme-light',
		});
		this.darkCard = this.container.createEl('div', {
			cls: 'chemcard theme-dark',
		});

		this.settings = this.argSettings;
	}

	render = () => {
		this.lightCard.empty();
		const lightWidth = this.renderCell(
			this.settings.sample1,
			this.lightCard,
			this.settings.lightTheme
		);

		this.darkCard.empty();
		const darkWidth = this.renderCell(
			this.settings.sample2,
			this.darkCard,
			this.settings.darkTheme
		);

		if (this.settings.options.scale == 0)
			this.container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${
				this.settings?.imgWidth ?? '300'
			}px, 1fr)`;
		else
			this.container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${(lightWidth >
			darkWidth
				? lightWidth
				: darkWidth
			).toString()}px, 1fr)`;
	};

	updateSettings = (argSettings: ChemPluginSettings) => {
		this.settings = argSettings;
	};

	private renderCell = (
		source: string,
		target: HTMLElement,
		style: string
	) => {
		const svg = target.createSvg('svg') as SVGSVGElement;
		SmilesDrawer.parse(source, (tree: object) => {
			gDrawer.draw(tree, svg, style);
		});
		if (this.settings.options.scale == 0)
			svg.style.width = `${this.settings?.imgWidth ?? '300'}px`;
		else if (
			parseFloat(svg.style.width) > (this.settings.options?.width ?? 300)
		) {
			svg.style.width = `${(
				this.settings.options?.width ?? 300
			).toString()}px`;
			svg.style.height = `${(
				this.settings.options?.height ?? 300
			).toString()}px`;
		}
		return parseFloat(svg.style.width);
	};
}
