import {
	MarkdownRenderChild,
	MarkdownPostProcessorContext,
	Menu,
	Notice,
} from 'obsidian';
import { gDrawer } from './global/drawer';
import { ChemPluginSettings } from './settings/base';
import { addBlock, removeBlock } from './global/blocks';

import { i18n } from 'src/lib/i18n';

import { svgToPng } from './utils';

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
		svg.setAttribute('versions', '1.1');
		svg.setAttribute('baseProfile', 'full');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		return svg;
	};

	private handleContextMenu = (event: MouseEvent) => {
		const targetEl = event.target as HTMLElement;
		const closestSVG =
			targetEl.tagName === 'svg' ? targetEl : targetEl.closest('svg');

		if (!closestSVG) {
			return;
		}

		const menu = new Menu();
		menu.addItem((item) => {
			item.setTitle(i18n.t('menus.copy.title'))
				.setIcon('copy')
				.onClick(async () => {
					svgToPng(closestSVG.outerHTML, (imageData) => {
						let image = new Image();
						image.crossOrigin = 'anonymous';
						document.body.appendChild(image);
						image.src = imageData;

						image.onload = () => {
							const canvas = document.createElement('canvas');

							canvas.width = image.width;
							canvas.height = image.height;
							const ctx = canvas.getContext('2d');
							if (!ctx) {
								new Notice('context not found');
								return;
							}
							ctx.fillStyle = '#fff'; // follow light/dark settings
							ctx.fillRect(0, 0, canvas.width, canvas.height);
							ctx.drawImage(image, 0, 0);
							try {
								canvas.toBlob(async (blob: Blob) => {
									await navigator.clipboard
										.write([
											new ClipboardItem({
												'image/png': blob,
											}),
										])
										.then(
											() =>
												new Notice(
													i18n.t('menus.copy.success')
												),
											() =>
												new Notice(
													i18n.t('menus.copy.error')
												)
										);
								});
							} catch (error) {
								new Notice(i18n.t('menus.copy.error'));
							}
						};
						image.onerror = () => {
							new Notice(i18n.t('menus.copy.error'));
						};
					});
				});
		});
		menu.showAtMouseEvent(event);
	};

	async onload() {
		this.render();
		this.registerDomEvent(this.el, 'contextmenu', this.handleContextMenu);
	}

	onunload() {
		removeBlock(this); // remove from global block list
	}
}
