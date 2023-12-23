import {
	MarkdownRenderChild,
	MarkdownPostProcessorContext,
	Menu,
	Notice,
} from 'obsidian';
import { gDrawer } from './global/drawer';
import { ChemPluginSettings, DEFAULT_SD_OPTIONS } from './settings/base';
import { addBlock, removeBlock } from './global/blocks';

import { i18n } from 'src/lib/i18n';

export class SmilesBlock extends MarkdownRenderChild {
	theme: string;

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
		this.theme =
			document.body.hasClass('theme-dark') &&
			!document.body.hasClass('theme-light')
				? this.settings.darkTheme
				: this.settings.lightTheme;

		const rows = this.markdownSource
			.split('\n')
			.filter((row) => row.length > 0)
			.map((row) => row.trim());

		if (rows.length == 1) {
			const div = this.el.createDiv({ cls: 'chem-cell' });
			this.renderCell(rows[0], div, this.theme);
		} else {
			const table = this.el.createDiv({ cls: 'chem-table' });
			const maxWidth = this.settings.options?.width ?? 300;

			rows.forEach((row) => {
				const cell = table.createDiv({ cls: 'chem-cell' });
				const svgcell = this.renderCell(row, cell, this.theme);
				if (parseFloat(svgcell.style.width) > maxWidth) {
					const r =
						parseFloat(svgcell.style.width) /
						parseFloat(svgcell.style.height);
					svgcell.style.width = `${maxWidth.toString()}px`;
					svgcell.style.height = `${(maxWidth / r).toString()}px`;
				}
			});

			table.style.gridTemplateColumns = `repeat(auto-fill, minmax(${
				this.settings.options.width?.toString() ?? '300'
			}px, 1fr)`;
		}
	}

	private renderCell = (
		source: string,
		target: HTMLElement,
		theme: string
	) => {
		const svg = target.createSvg('svg');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svg.setAttribute('data-smiles', source);

		const errorCb = (
			error: object & { name: string; message: string },
			container: HTMLDivElement
		) => {
			container
				.createDiv('error-source')
				.setText(i18n.t('errors.source.title', { source }));
			container.createEl('br');
			const info = container.createEl('details');
			info.createEl('summary').setText(error.name);
			info.createEl('div').setText(error.message);

			container.style.wordBreak = `break-word`;
			container.style.userSelect = `text`;
		};

		gDrawer.draw(
			source,
			svg,
			theme,
			null,
			(error: object & { name: string; message: string }) => {
				target.empty();
				errorCb(error, target.createEl('div'));
			}
		);
		if (this.settings.options.scale == 0)
			svg.style.width = `${this.settings.imgWidth.toString()}px`;
		return svg;
	};

	private handleContextMenu = (event: MouseEvent) => {
		const targetEl = event.target as HTMLElement;
		const closestSVG =
			targetEl.tagName === 'svg' ? targetEl : targetEl.closest('svg');
		if (!closestSVG) return;

		const menu = new Menu();
		menu.addItem((item) => {
			item.setTitle(i18n.t('menus.copy.title'))
				.setIcon('copy')
				.onClick(() => {
					const svg = closestSVG.outerHTML;
					const source =
						closestSVG.attributes.getNamedItem('data-smiles')
							?.value ?? '';
					const rect = closestSVG.getBoundingClientRect();
					this.onCopy(svg, source, rect.width, rect.height);
				});
		});
		menu.showAtMouseEvent(event);
	};

	async onload() {
		this.render();
		this.registerDomEvent(this.el, 'contextmenu', this.handleContextMenu);
	}

	// Credits to Thom Kiesewetter @ Stack Overflow https://stackoverflow.com/a/58142441
	// Credits to image-toolkit plugin by Sissilab @ GitHub
	async onCopy(svgString: string, source: string, w: number, h: number) {
		// Redraw if changing theme
		const copyTheme = this.settings.copy.theme;
		if (copyTheme !== 'default' && copyTheme !== this.theme) {
			const div = this.containerEl.createDiv();
			div.style.display = 'none';

			const svg = this.renderCell(source, div, copyTheme);
			svgString = svg.outerHTML;
			svg.remove();
		}

		const svgUrl = URL.createObjectURL(
			new Blob([svgString], {
				type: 'image/svg+xml',
			})
		);

		const image = new Image();
		image.src = svgUrl;
		image.onload = () => {
			const canvas = document.createElement('canvas');

			const f = this.settings.copy.scale;
			canvas.width = f * w;
			canvas.height = f * h;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				new Notice(i18n.t('menus.copy.error'));
				URL.revokeObjectURL(svgUrl);
				return;
			}
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';

			// Apply background color
			if (!this.settings.copy.transparent) {
				ctx.fillStyle = DEFAULT_SD_OPTIONS.themes[copyTheme].BACKGROUND;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}

			ctx.scale(f, f);
			ctx.drawImage(image, 0, 0, w, h);

			try {
				canvas.toBlob(async (blob: Blob) => {
					await navigator.clipboard
						.write([new ClipboardItem({ 'image/png': blob })])
						.then(
							() => new Notice(i18n.t('menus.copy.success')),
							() => new Notice(i18n.t('menus.copy.error'))
						);
				});
			} catch (e) {
				new Notice(i18n.t('menus.copy.error'));
			}

			URL.revokeObjectURL(svgUrl);
		};
		image.onerror = () => {
			new Notice(i18n.t('menus.copy.error'));
			URL.revokeObjectURL(svgUrl);
		};
	}

	onunload() {
		removeBlock(this); // remove from global block list
	}
}
