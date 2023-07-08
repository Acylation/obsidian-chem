import {
	App,
	PluginSettingTab,
	Setting,
	SliderComponent,
	TextComponent,
} from 'obsidian';

import ChemPlugin from '../main';
import { DEFAULT_SD_OPTIONS, SAMPLE_SMILES, themeList } from './base';
import { gDrawer, setDrawer } from 'src/drawer';
import { refreshBlocks } from 'src/blocks';
import SmilesDrawer from 'smiles-drawer';

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

		// ban this
		new Setting(containerEl)
			.setName('Image Width')
			.setDesc('Adjust the width of the molecule image.')
			.addText((text) =>
				text
					.setValue(
						this.plugin.settings.options?.width?.toString() ?? '300'
					)
					.setPlaceholder('300')
					.onChange(async (value) => {
						if (value == '') {
							value = '300';
						}
						this.plugin.settings.options.width = parseInt(value);
						this.plugin.settings.options.height = parseInt(value);
						await this.plugin.saveSettings();
						onOptionsChange();
					})
			);

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
						onLightStyleChange(value);
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
						onDarkStyleChange(value);
					})
			);

		containerEl.createEl('h2', { text: 'Live Preview' });

		new Setting(containerEl)
			.setName('Sample Smiles')
			.setDesc('Input smiles strings to see the styled structure.')
			.addText((text) =>
				text
					.setPlaceholder(SAMPLE_SMILES)
					.setValue(this.plugin.settings.sample)
					.onChange(async (value) => {
						if (value == '') {
							value = SAMPLE_SMILES;
						}
						this.plugin.settings.sample = value;
						await this.plugin.saveSettings();
						onSampleChange(value);
					})
			);

		const div = containerEl.createEl('div');
		div.style.display = 'grid';
		div.style.gridTemplateColumns = `repeat(auto-fill, minmax(${this.plugin.settings.width}px, 1fr)`;

		const lightCard = div.createEl('div', { cls: 'chemcard theme-light' });
		const darkCard = div.createEl('div', { cls: 'chemcard theme-dark' });

		new Setting(containerEl)
			.setName('Advanced Settings')
			.setDesc('Configure smiles drawer options.')
			.setHeading();

		// Scaling config
		const scaleSetting = new Setting(containerEl)
			.setName('Scale')
			.setDesc('Adjust the global molecule scale.')
			.addExtraButton((button) => {
				button.setIcon('rotate-ccw').onClick(async () => {
					this.plugin.settings.options.scale = 1;
					scaleSlider.setValue(50);
					scaleText.setValue('1.0');
					await this.plugin.saveSettings();
					onOptionsChange();
				});
			});

		const scaleSlider = new SliderComponent(scaleSetting.controlEl)
			.setValue(50 * (this.plugin.settings.options.scale ?? 1.0))
			.setLimits(0.0, 100, 0.5)
			.setDynamicTooltip()
			.onChange(async (value) => {
				this.plugin.settings.options.scale = value / 50;
				scaleText.setValue((value / 50).toString());
				await this.plugin.saveSettings();
				onOptionsChange();
			});

		const scaleText = new TextComponent(scaleSetting.controlEl)
			.setValue((this.plugin.settings.options.scale ?? 1.0).toString())
			.setPlaceholder('1.0')
			.onChange(async (text) => {
				this.plugin.settings.options.scale = parseFloat(text);
				scaleSlider.setValue(50 * parseFloat(text));
				await this.plugin.saveSettings();
				onOptionsChange();
			})
			.setDisabled(true);

		new Setting(containerEl)
			.setName('Compact Drawing')
			.setDesc('Enable to linearize simple structures. (Unrecommanded)')
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settings.options.compactDrawing ?? false
					)
					.onChange(async (value) => {
						this.plugin.settings.options.compactDrawing = value;
						await this.plugin.saveSettings();
						onOptionsChange();
					})
			);

		const onOptionsChange = () => {
			setDrawer({
				...DEFAULT_SD_OPTIONS,
				...this.plugin.settings.options,
			});

			lightCard.empty();
			const lightSvg = lightCard.createSvg('svg');
			SmilesDrawer.parse(this.plugin.settings.sample, (tree: any) => {
				gDrawer.draw(tree, lightSvg, this.plugin.settings.lightTheme);
			});

			darkCard.empty();
			const darkSvg = darkCard.createSvg('svg');
			SmilesDrawer.parse(this.plugin.settings.sample, (tree: any) => {
				gDrawer.draw(tree, darkSvg, this.plugin.settings.darkTheme);
			});
		};

		const onLightStyleChange = (style: string) => {
			lightCard.empty();
			const lightSvg = lightCard.createSvg('svg');
			SmilesDrawer.parse(this.plugin.settings.sample, (tree: any) => {
				gDrawer.draw(tree, lightSvg, style);
			});
		};

		const onDarkStyleChange = (style: string) => {
			darkCard.empty();
			const darkSvg = darkCard.createSvg('svg');
			SmilesDrawer.parse(this.plugin.settings.sample, (tree: any) => {
				gDrawer.draw(tree, darkSvg, style);
			});
		};

		const onSampleChange = (example: string) => {
			lightCard.empty();
			const lightSvg = lightCard.createSvg('svg');
			SmilesDrawer.parse(example, (tree: any) => {
				gDrawer.draw(tree, lightSvg, this.plugin.settings.lightTheme);
			});

			darkCard.empty();
			const darkSvg = darkCard.createSvg('svg');
			SmilesDrawer.parse(example, (tree: any) => {
				gDrawer.draw(tree, darkSvg, this.plugin.settings.darkTheme);
			});
		};

		// initialize
		const initialize = (
			sample: string,
			lightTheme: string,
			darkTheme: string
		) => {
			lightCard.empty();
			const lightSvg = lightCard.createSvg('svg');
			SmilesDrawer.parse(
				sample == '' ? SAMPLE_SMILES : sample,
				(tree: any) => {
					gDrawer.draw(
						tree,
						lightSvg,
						lightTheme == '' ? 'light' : lightTheme
					);
				}
			);

			darkCard.empty();
			const darkSvg = darkCard.createSvg('svg');
			SmilesDrawer.parse(
				sample == '' ? SAMPLE_SMILES : sample,
				(tree: any) => {
					gDrawer.draw(
						tree,
						darkSvg,
						darkTheme == '' ? 'dark' : darkTheme
					);
				}
			);
		};
		initialize(
			this.plugin.settings.sample,
			this.plugin.settings.lightTheme,
			this.plugin.settings.darkTheme
		);
	}

	hide(): void {
		refreshBlocks();
	}
}
