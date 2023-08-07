import { MarkdownRenderChild, MarkdownPostProcessorContext } from 'obsidian';
import { gDrawer } from './global/drawer';
import { ChemPluginSettings } from './settings/base';
import { addBlock, removeBlock } from './global/blocks';

import { i18n } from 'src/lib/i18n';

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
		// TODO: rendering animation

		this.el.empty();
		const rows = this.markdownSource
			.split('\n')
			.filter((row) => row.length > 0)
			.map((row) => row.trim());

		if (rows.length == 1) {
			const div = this.el.createDiv({ cls: 'chem-cell' });
			this.renderCell(rows[0], div);
		} else {
			const table = this.el.createDiv({ cls: 'chem-table' });
			const maxWidth = this.settings.options?.width ?? 300;

			rows.forEach((row) => {
				const cell = table.createDiv({ cls: 'chem-cell' });
				const svgcell = this.renderCell(row, cell);
				if (parseFloat(svgcell.style.width) > maxWidth)
					svgcell.style.width = `${maxWidth.toString()}px`;
			});

			table.style.gridTemplateColumns = `repeat(auto-fill, minmax(${
				this.settings.options.width?.toString() ?? '300'
			}px, 1fr)`;
		}
	}

	private renderCell = (source: string, target: HTMLElement) => {
		const svg = target.createSvg('svg');
		gDrawer.draw(
			source,
			svg,
			document.body.hasClass('theme-dark') &&
				!document.body.hasClass('theme-light')
				? this.settings.darkTheme
				: this.settings.lightTheme,
			null,
			(error: object & { name: string; message: string }) => {
				target.empty();
				const ErrorContainer = target.createEl('div');
				ErrorContainer.createDiv('error-source').setText(
					i18n.t('errors.source.title', { source: source })
				);
				ErrorContainer.createEl('br');
				const ErrorInfo = ErrorContainer.createEl('details');
				ErrorInfo.createEl('summary').setText(error.name);
				ErrorInfo.createEl('div').setText(error.message);

				ErrorContainer.style.wordBreak = `break-word`;
				ErrorContainer.style.userSelect = `text`;

				//TODO: in multiline block, keep the width sync with the grid setting
				if (this.settings.options.scale == 0)
					ErrorContainer.style.width = `${
						this.settings?.imgWidth.toString() ?? '300'
					}px`;
				else if (
					ErrorContainer.offsetWidth >
					(this.settings.options?.width ?? 300)
				) {
					ErrorContainer.style.width = `${(
						this.settings.options?.width ?? 300
					).toString()}px`;
					ErrorContainer.style.height = `${(
						this.settings.options?.height ?? 300
					).toString()}px`;
				}
			}
		);
		if (this.settings.options.scale == 0)
			svg.style.width = `${this.settings.imgWidth.toString()}px`;
		return svg;
	};

	async onload() {
		this.render();
	}

	onunload() {
		removeBlock(this); // remove from global block list
	}
}
