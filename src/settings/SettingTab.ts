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

		// TODO: Check styling instructions and remove this
		containerEl.createEl('h2', { text: 'Style Preferences' });

		new Setting(containerEl)
			.setName('Light Theme')
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
			.setName('Dark Theme')
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

		containerEl.createEl('h2', { text: 'Live Preview' });

		new Setting(containerEl)
			.setName('Sample Smiles 1')
			.setDesc('Input smiles strings to see the styled structure.')
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
			);

		new Setting(containerEl)
			.setName('Sample Smiles 2')
			.setDesc('Input smiles strings to see the styled structure.')
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
		preview.render(); //initialize

		new Setting(containerEl)
			.setName('Advanced Settings')
			.setDesc('Configure smiles drawer options.')
			.setHeading();

		new Setting(containerEl)
			.setName('Image Width')
			.setDesc('Adjust the width of the molecule image.')
			.addText((text) => {
				text.setValue(this.plugin.settings?.imgWidth ?? '300')
					.setPlaceholder('300')
					.onChange(async (value) => {
						if (value == '') {
							value = '300';
						}
						this.plugin.settings.imgWidth = value;
						await this.plugin.saveSettings();
						onSettingsChange();
					});
			});

		const scaleSetting = new Setting(containerEl)
			.setName('Scale')
			.setDesc('Adjust the global molecule scale.')
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
			});

		new Setting(containerEl)
			.setName('Max width in table') // width limitation
			.setDesc('Maximum width in multiline')
			.addText((text) =>
				text
					.setValue(
						this.plugin.settings.options.width?.toString() ?? '300'
					)
					.onChange(async (value) => {
						if (value == '') {
							value = '300';
						}
						this.plugin.settings.options.width = parseInt(value);
						this.plugin.settings.options.height = parseInt(value);
						await this.plugin.saveSettings();
						setDrawer({
							...DEFAULT_SD_OPTIONS,
							...this.plugin.settings.options,
						});
						onSettingsChange();
					})
			);

		new Setting(containerEl)
			.setName('Compact Drawing')
			.setDesc('Linearize simple structures and functional groups.')
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settings.options.compactDrawing ?? false
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

		const onSettingsChange = () => {
			preview.updateSettings(this.plugin.settings);
			preview.render();
		};
	}

	hide(): void {
		refreshBlocks();
	}
}
