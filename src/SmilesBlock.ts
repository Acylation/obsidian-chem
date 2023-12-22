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

	private renderCell = (source: string, target: HTMLElement) => {
		const svg = target.createSvg('svg');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

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

			if (this.settings.options.scale == 0)
				container.style.width = `${(
					this.settings?.imgWidth ?? 300
				).toString()}px`;
			else if (
				container.clientWidth > (this.settings.options?.width ?? 300)
			) {
				container.style.width = `${(
					this.settings.options?.width ?? 300
				).toString()}px`;
			}
		};

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

		if (!closestSVG) {
			return;
		}

		const menu = new Menu();
		menu.addItem((item) => {
			item.setTitle(i18n.t('menus.copy.title'))
				.setIcon('copy')
				.onClick(() => {
					const svg = closestSVG.outerHTML;
					const rect = closestSVG.getBoundingClientRect();
					this.onCopy(svg, rect.width, rect.height);
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
	async onCopy(svg: string, w: number, h: number) {
		const svgUrl = URL.createObjectURL(
			new Blob([svg], {
				type: 'image/svg+xml',
			})
		);

		const image = new Image();
		image.src = svgUrl;
		image.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = 2 * w;
			canvas.height = 2 * h;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				new Notice(i18n.t('menus.copy.error'));
				URL.revokeObjectURL(svgUrl);
				return;
			}
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';

			ctx.scale(2, 2);
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
