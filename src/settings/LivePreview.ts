import { ChemPluginSettings } from '../settings/base';
import { gDrawer } from 'src/global/drawer';
import { i18n } from 'src/lib/i18n';

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
		this.container.style.flexWrap = `wrap`;
		this.container.style.justifyContent = `center`;

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
			this.container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${(
				this.settings?.imgWidth ?? 300
			).toString()}px, 1fr)`;
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
			container.style.display = `grid`;
			container.style.alignContent = `center`;

			if (this.settings.options.scale == 0)
				container.style.width = `${(
					this.settings?.imgWidth ?? 300
				).toString()}px`;
			else if (
				container.offsetWidth > (this.settings.options?.width ?? 300)
			) {
				container.style.width = `${(
					this.settings.options?.width ?? 300
				).toString()}px`;
			}
		};

		gDrawer.draw(
			source,
			svg,
			style,
			null,
			(error: object & { name: string; message: string }) => {
				target.empty();
				errorCb(error, target.createEl('div'));
			}
		);
		if (this.settings.options.scale == 0)
			svg.style.width = `${(
				this.settings?.imgWidth ?? 300
			).toString()}px`;
		else if (
			parseFloat(svg.style.width) > (this.settings.options?.width ?? 300)
		) {
			const r =
				parseFloat(svg.style.width) / parseFloat(svg.style.height);
			svg.style.width = `${(
				this.settings.options?.width ?? 300
			).toString()}px`;
			svg.style.height = `${(
				(this.settings.options?.width ?? 300) / r
			).toString()}px`;
		}
		return parseFloat(svg.style.width);
	};
}
