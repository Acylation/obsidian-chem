import { App, PluginSettingTab, Setting, SliderComponent } from 'obsidian';

import ChemPlugin from '../main';
import { themeList } from './theme';
import { DEFAULT_SETTINGS } from './base';
import { DEFAULT_SD_OPTIONS } from './smilesDrawerOptions';

import { setCore } from 'src/global/chemCore';
import { refreshBlocks } from 'src/global/blocks';
import { clearDataview, getDataview } from 'src/global/dataview';
import { LivePreview } from './LivePreview';

import { i18n } from 'src/lib/i18n';

import { debounce } from 'obsidian';

export class ChemSettingTab extends PluginSettingTab {
	plugin: ChemPlugin;

	constructor({ app, plugin }: { app: App; plugin: ChemPlugin }) {
		super(app, plugin);
		this.plugin = plugin;
	}

	//TODO: Caching proposed

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const scaleSetting = new Setting(containerEl)
			.setName(i18n.t('settings.scale.name'))
			.setDesc(i18n.t('settings.scale.description'))
			.addExtraButton((button) => {
				button
					.setIcon('rotate-ccw')
					.setTooltip(i18n.t('settings.scale.description'))
					.onClick(async () => {
						this.plugin.settings.smilesDrawerOptions.moleculeOptions.scale = 1;
						scaleSlider.setValue(50);
						await this.plugin.saveSettings();
						this.updateDrawer();
						onSettingsChange();
						unifyBondLength();
					});
			});

		const scaleLabel = scaleSetting.controlEl.createDiv('slider-readout');
		scaleLabel.setText(
			(
				this.plugin.settings.smilesDrawerOptions.moleculeOptions
					.scale ?? 1.0
			)
				.toFixed(2)
				.toString()
		);

		const scaleSlider = new SliderComponent(scaleSetting.controlEl)
			.setValue(
				50 *
					(this.plugin.settings.smilesDrawerOptions.moleculeOptions
						.scale ?? 1.0)
			)
			.setLimits(0.0, 100, 0.5)
			.onChange(async (value) => {
				this.plugin.settings.smilesDrawerOptions.moleculeOptions.scale =
					value / 50;
				scaleLabel.setText((value / 50).toFixed(2).toString());
				await this.plugin.saveSettings();
				this.updateDrawer();
				onSettingsChange(true);
				if (value == 0) unifyImageWidth();
				else unifyBondLength();
			});

		const widthSettings = new Setting(containerEl);

		new Setting(containerEl)
			.setName(i18n.t('settings.theme.light.name'))
			.setDesc(i18n.t('settings.theme.light.description'))
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(themeList)
					.setValue(this.plugin.settings.lightTheme)
					.onChange(async (value) => {
						this.plugin.settings.lightTheme = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName(i18n.t('settings.theme.dark.name'))
			.setDesc(i18n.t('settings.theme.dark.description'))
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(themeList)
					.setValue(this.plugin.settings.darkTheme)
					.onChange(async (value) => {
						this.plugin.settings.darkTheme = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName(i18n.t('settings.preview.title'))
			.setHeading();

		new Setting(containerEl)
			.setName(i18n.t('settings.preview.sample.name'))
			.setDesc(i18n.t('settings.preview.sample.description'))
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.sample1)
					.setValue(this.plugin.settings.sample1)
					.onChange(async (value) => {
						if (value == '') {
							value = DEFAULT_SETTINGS.sample1;
						}
						this.plugin.settings.sample1 = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			)
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.sample2)
					.setValue(this.plugin.settings.sample2)
					.onChange(async (value) => {
						if (value == '') {
							value = DEFAULT_SETTINGS.sample2;
						}
						this.plugin.settings.sample2 = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			);

		const preview = new LivePreview(containerEl, this.plugin.settings);

		new Setting(containerEl)
			.setName(i18n.t('settings.advanced.title'))
			.setHeading();

		new Setting(containerEl)
			.setName(i18n.t('settings.advanced.compact-drawing.name'))
			.setDesc(i18n.t('settings.advanced.compact-drawing.description'))
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settings.smilesDrawerOptions.moleculeOptions
							.compactDrawing ?? false
					)
					.onChange(async (value) => {
						this.plugin.settings.smilesDrawerOptions.moleculeOptions.compactDrawing =
							value;
						await this.plugin.saveSettings();
						this.updateDrawer();
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName(i18n.t('settings.advanced.terminal-carbons.name'))
			.setDesc(i18n.t('settings.advanced.terminal-carbons.description'))
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settings.smilesDrawerOptions.moleculeOptions
							.terminalCarbons ?? false
					)
					.onChange(async (value) => {
						this.plugin.settings.smilesDrawerOptions.moleculeOptions.terminalCarbons =
							value;
						await this.plugin.saveSettings();
						this.updateDrawer();
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName(i18n.t('settings.advanced.explicit-hydrogen.name'))
			.setDesc(i18n.t('settings.advanced.explicit-hydrogen.description'))
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settings.smilesDrawerOptions.moleculeOptions
							.explicitHydrogens ?? false
					)
					.onChange(async (value) => {
						this.plugin.settings.smilesDrawerOptions.moleculeOptions.explicitHydrogens =
							value;
						await this.plugin.saveSettings();
						this.updateDrawer();
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName(i18n.t('settings.copy.title'))
			.setHeading();

		new Setting(containerEl)
			.setName(i18n.t('settings.copy.scale.name'))
			.setDesc(i18n.t('settings.copy.scale.description'))
			.addText((text) =>
				text
					.setValue(this.plugin.settings.copy.scale.toString())
					.onChange(async (value) => {
						this.plugin.settings.copy.scale = parseFloat(value);
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName(i18n.t('settings.copy.transparent.name'))
			.setDesc(i18n.t('settings.copy.transparent.description'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.copy.transparent)
					.onChange(async (value) => {
						this.plugin.settings.copy.transparent = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName(i18n.t('settings.copy.theme.name'))
			.setDesc(i18n.t('settings.copy.theme.description'))
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						default: i18n.t('settings.copy.theme.default'),
						...themeList,
					})
					.setValue(this.plugin.settings.copy.theme)
					.onChange(async (value) => {
						this.plugin.settings.copy.theme = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName(i18n.t('settings.dataview.title'))
			.setHeading();

		new Setting(containerEl)
			.setName(i18n.t('settings.dataview.enable.name'))
			.setDesc(i18n.t('settings.dataview.enable.description'))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.dataview)
					.onChange(async (value) => {
						this.plugin.settings.dataview = value;
						if (value) {
							getDataview();
						} else {
							clearDataview();
						}
						await this.plugin.saveSettings();
						onSettingsChange();
					});
			});

		new Setting(containerEl)
			.setName(i18n.t('settings.inline.title'))
			.setHeading();

		new Setting(containerEl)
			.setName(i18n.t('settings.inline.enable.name'))
			.setDesc(i18n.t('settings.inline.enable.description'))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.inlineSmiles)
					.onChange(async (value) => {
						this.plugin.settings.inlineSmiles = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					});
			});

		new Setting(containerEl)
			.setName(i18n.t('settings.inline.prefix.name'))
			.setDesc(i18n.t('settings.inline.prefix.description'))
			.addText((text) => {
				text.setValue(this.plugin.settings.inlineSmilesPrefix).onChange(
					async (value) => {
						this.plugin.settings.inlineSmilesPrefix = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					}
				);
			});

		const onSettingsChange = (debounced?: boolean) => {
			preview.updateSettings(this.plugin.settings);
			debounced ? debouncedRender() : preview.render();
		};

		const debouncedRender = debounce(preview.render, 100, false); // throttle

		const unifyBondLength = () => {
			widthSettings.controlEl.empty();
			widthSettings
				.setName(i18n.t('settings.unify-bond-length.name'))
				.setDesc(i18n.t('settings.unify-bond-length.description'))
				.addText((text) =>
					text
						.setValue(
							this.plugin.settings.smilesDrawerOptions.moleculeOptions.width?.toString() ??
								'300'
						)
						.onChange(async (value) => {
							if (value == '') {
								value = '300';
							}
							this.plugin.settings.smilesDrawerOptions.moleculeOptions.width =
								parseInt(value);
							await this.plugin.saveSettings();
							this.updateDrawer();
							onSettingsChange();
						})
				);
		};

		const unifyImageWidth = () => {
			widthSettings.controlEl.empty();
			widthSettings
				.setName(i18n.t('settings.unify-image-width.name'))
				.setDesc(i18n.t('settings.unify-image-width.description'))
				.addText((text) => {
					text.setValue(
						this.plugin.settings?.imgWidth.toString() ?? '300'
					)
						.setPlaceholder('300')
						.onChange(async (value) => {
							if (value == '') {
								value = '300';
							}
							this.plugin.settings.imgWidth = parseInt(value);
							await this.plugin.saveSettings();
							onSettingsChange();
						});
				});
		};

		// Initialize
		preview.render();
		if (
			(this.plugin.settings.smilesDrawerOptions.moleculeOptions.scale ??
				1) == 0
		)
			unifyImageWidth();
		else unifyBondLength();
	}

	hide(): void {
		refreshBlocks();
	}

	updateDrawer = () =>
		setDrawer(
			{
				...DEFAULT_SD_OPTIONS.moleculeOptions,
				...this.plugin.settings.smilesDrawerOptions.moleculeOptions,
			},
			{
				...DEFAULT_SD_OPTIONS.reactionOptions,
				...this.plugin.settings.smilesDrawerOptions.reactionOptions,
			}
		);
}
