import type { ChemCore } from './ChemCore';

import SmilesDrawer from 'smiles-drawer';
import { ChemPluginSettings } from 'src/settings/base';
import { DEFAULT_SD_OPTIONS } from 'src/lib/core/smilesDrawerOptions';
import { getCurrentTheme } from 'src/lib/themes/getCurrentTheme';

import { i18n } from 'src/lib/i18n';

export default class SmilesDrawerCore implements ChemCore {
	id: 'smiles-drawer';
	settings: ChemPluginSettings;
	core: SmilesDrawer.SmiDrawer;
	private optionsSignature: string;

	constructor(settings: ChemPluginSettings) {
		this.settings = settings;
		const { moleculeOptions, reactionOptions, signature } =
			this.buildOptions(settings);
		this.core = new SmilesDrawer.SmiDrawer(moleculeOptions, reactionOptions);
		this.optionsSignature = signature;
	}

	private syncDrawer() {
		const { moleculeOptions, reactionOptions, signature } = this.buildOptions(
			this.settings
		);
		if (signature !== this.optionsSignature) {
			this.core = new SmilesDrawer.SmiDrawer(moleculeOptions, reactionOptions);
			this.optionsSignature = signature;
		}
	}

	buildOptions = (settings: ChemPluginSettings) => {
		const common = settings.commonOptions ?? {};

		const moleculeOverrides =
			settings.smilesDrawerOptions?.moleculeOptions ?? {};
		const reactionOverrides =
			settings.smilesDrawerOptions?.reactionOptions ?? {};

		const moleculeOptions = {
			...DEFAULT_SD_OPTIONS.moleculeOptions,
			...moleculeOverrides,
			...common,
		};

		const reactionOptions = {
			...DEFAULT_SD_OPTIONS.reactionOptions,
			...reactionOverrides,
		};

		return {
			moleculeOptions,
			reactionOptions,
			signature: JSON.stringify({ moleculeOptions, reactionOptions }),
		};
	};

	draw = async (
		source: string,
		theme: string = getCurrentTheme(this.settings)
	) => {
		this.syncDrawer();
		const svg = createSvg('svg');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svg.setAttribute('data-smiles', source);

		const errorDiv = createDiv();
		const errorCb = (error: object & { name: string; message: string }) => {
			errorDiv
				.createDiv('error-source')
				.setText(i18n.t('errors.source.title', { source }));
			errorDiv.createEl('br');
			const info = errorDiv.createEl('details');
			info.createEl('summary').setText(error.name);
			info.createEl('div').setText(error.message);

			errorDiv.style.wordBreak = `break-word`;
			errorDiv.style.userSelect = `text`;
		};

		this.core.draw(source, svg, theme, () => {}, errorCb);

		if (this.settings.commonOptions.scale == 0)
			svg.style.width = `${(
				this.settings?.commonOptions.unifiedWidth ?? 300
			).toString()}px`;
		else if (
			parseFloat(svg.style.width) > (this.settings.commonOptions?.width ?? 300)
		) {
			const r = parseFloat(svg.style.width) / parseFloat(svg.style.height);
			svg.style.width = `${(
				this.settings.commonOptions?.width ?? 300
			).toString()}px`;
			svg.style.height = `${(
				(this.settings.commonOptions?.width ?? 300) / r
			).toString()}px`;
		}

		if (errorDiv.innerHTML) return errorDiv;
		return svg;
	};
}
