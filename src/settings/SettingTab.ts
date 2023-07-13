import { App, PluginSettingTab, Setting, SliderComponent } from 'obsidian';

import ChemPlugin from '../main';
import {
	DEFAULT_SD_OPTIONS,
	SAMPLE_SMILES_1,
	SAMPLE_SMILES_2,
	themeList,
} from './base';

import { setDrawer } from 'src/drawer';
import { refreshBlocks } from 'src/blocks';
import { LivePreview } from './LivePreview';

//Reference: https://smilesdrawer.surge.sh/playground.html

export class ChemSettingTab extends PluginSettingTab {
	plugin: ChemPlugin;

	constructor({ app, plugin }: { app: App; plugin: ChemPlugin }) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const scaleSetting = new Setting(containerEl)
			.setName('Scale')
			.setDesc(
				'Adjust the global molecule scale. If set to zero, the image widths will be unified. Otherwise, the structures will share the same bond length, but the image widths will vary.'
			)
			.addExtraButton((button) => {
				button
					.setIcon('rotate-ccw')
					.setTooltip('Restore default')
					.onClick(async () => {
						this.plugin.settings.options.scale = 1;
						scaleSlider.setValue(50);
						await this.plugin.saveSettings();
						setDrawer({
							...DEFAULT_SD_OPTIONS,
							...this.plugin.settings.options,
						});
						onSettingsChange();
						unifyBondLength();
					});
			});

		const scaleLabel = scaleSetting.controlEl.createDiv('slider-readout');
		scaleLabel.setText(
			(this.plugin.settings.options.scale ?? 1.0).toFixed(2).toString()
		);

		const scaleSlider = new SliderComponent(scaleSetting.controlEl)
			.setValue(50 * (this.plugin.settings.options.scale ?? 1.0))
			.setLimits(0.0, 100, 0.5)
			.onChange(async (value) => {
				this.plugin.settings.options.scale = value / 50;
				scaleLabel.setText((value / 50).toFixed(2).toString());
				await this.plugin.saveSettings();
				setDrawer({
					...DEFAULT_SD_OPTIONS,
					...this.plugin.settings.options,
				});
				onSettingsChange();
				if (value == 0) unifyImageWidth();
				else unifyBondLength();
			});

		const widthSettings = new Setting(containerEl);

		new Setting(containerEl)
			.setName('Light theme')
			.setDesc('Active when Obsidian is under light mode.')
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
			.setName('Dark theme')
			.setDesc('Active when Obsidian is under dark mode.')
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

		new Setting(containerEl).setName('Live Preview').setHeading();

		new Setting(containerEl)
			.setName('Sample SMILES strings')
			.setDesc('Input SMILES strings to see the styled structures.')
			.addText((text) =>
				text
					.setPlaceholder(SAMPLE_SMILES_1)
					.setValue(this.plugin.settings.sample1)
					.onChange(async (value) => {
						if (value == '') {
							value = SAMPLE_SMILES_1;
						}
						this.plugin.settings.sample1 = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			)
			.addText((text) =>
				text
					.setPlaceholder(SAMPLE_SMILES_2)
					.setValue(this.plugin.settings.sample2)
					.onChange(async (value) => {
						if (value == '') {
							value = SAMPLE_SMILES_2;
						}
						this.plugin.settings.sample2 = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					})
			);

		const preview = new LivePreview(containerEl, this.plugin.settings);

		new Setting(containerEl).setName('Advanced').setHeading();

		new Setting(containerEl)
			.setName('Compact drawing')
			.setDesc('Linearize simple structures and functional groups.')
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settings.options?.compactDrawing ?? false
					)
					.onChange(async (value) => {
						this.plugin.settings.options.compactDrawing = value;
						await this.plugin.saveSettings();
						setDrawer({
							...DEFAULT_SD_OPTIONS,
							...this.plugin.settings.options,
						});
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName('Show terminal carbons')
			.setDesc(
				'Explictly draw terminal carbons like methyl or methylene.'
			)
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settings.options?.terminalCarbons ?? false
					)
					.onChange(async (value) => {
						this.plugin.settings.options.terminalCarbons = value;
						await this.plugin.saveSettings();
						setDrawer({
							...DEFAULT_SD_OPTIONS,
							...this.plugin.settings.options,
						});
						onSettingsChange();
					})
			);

		const onSettingsChange = () => {
			preview.updateSettings(this.plugin.settings);
			preview.render();
		};

		const unifyBondLength = () => {
			widthSettings.controlEl.empty();
			widthSettings
				.setName('Maximum width')
				.setDesc(
					'Crop structure images that are too large in a multiline block.'
				)
				.addText((text) =>
					text
						.setValue(
							this.plugin.settings.options.width?.toString() ??
								'300'
						)
						.onChange(async (value) => {
							if (value == '') {
								value = '300';
							}
							this.plugin.settings.options.width =
								parseInt(value);
							this.plugin.settings.options.height =
								parseInt(value);
							await this.plugin.saveSettings();
							setDrawer({
								...DEFAULT_SD_OPTIONS,
								...this.plugin.settings.options,
							});
							onSettingsChange();
						})
				);
		};

		const unifyImageWidth = () => {
			widthSettings.controlEl.empty();
			widthSettings
				.setName('Image width')
				.setDesc(
					"Adjust the width of the molecule images. Only valid when 'scale' is set to zero."
				)
				.addText((text) => {
					text.setValue(this.plugin.settings?.width ?? '300')
						.setPlaceholder('300')
						.onChange(async (value) => {
							if (value == '') {
								value = '300';
							}
							this.plugin.settings.width = value;
							await this.plugin.saveSettings();
							onSettingsChange();
						});
				});
		};

		// initialize
		preview.render();
		if ((this.plugin.settings.options?.scale ?? 1) == 0) unifyImageWidth();
		else unifyBondLength();
	}

	hide(): void {
		refreshBlocks();
	}
}
