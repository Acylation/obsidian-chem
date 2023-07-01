import SmilesDrawer from 'smiles-drawer';

import { App, PluginSettingTab, Setting } from 'obsidian';

import ChemPlugin from '../main';
import { DEFAULT_SD_OPTIONS, SAMPLE_SMILES, themeList } from './base';
//Reference: https://smilesdrawer.surge.sh/playground.html

export class ChemSettingTab extends PluginSettingTab {
	plugin: ChemPlugin;
	drawer: any;

	constructor({ app, plugin }: { app: App; plugin: ChemPlugin }) {
		super(app, plugin);
		this.plugin = plugin;
		this.drawer = new SmilesDrawer.SmiDrawer({
			...DEFAULT_SD_OPTIONS,
			...this.plugin.settings.options,
		});
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
					.setValue(this.plugin.settings.width)
					.setPlaceholder('300')
					.onChange(async (value) => {
						if (value == '') {
							value = '300';
						}
						this.plugin.settings.width = value;
						await this.plugin.saveSettings();
						onWidthChange(value);
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

		// TODO: fill advance
		// dealing with performance problem
		containerEl.createEl('h2', { text: 'Advanced Settings' });

		new Setting(containerEl)
			.setName('Scale')
			.setDesc('Adjust the scale of the molecule image.')
			.addText((text) =>
				text
					.setValue(
						this.plugin.settings.options.scale?.toString() ?? '1'
					)
					.setPlaceholder('1')
					.onChange(async (value) => {
						if (value == '') {
							value = '1';
						}
						this.plugin.settings.options.scale = parseInt(value);
						await this.plugin.saveSettings();
						onOptionChange();
					})
			);

		const onOptionChange = () => {
			this.drawer = new SmilesDrawer.SmiDrawer({
				...DEFAULT_SD_OPTIONS,
				...this.plugin.settings.options,
			});

			lightCard.empty();
			const lightImg = lightCard.createEl('img') as HTMLImageElement;
			lightImg.width = parseInt(this.plugin.settings.width);
			this.drawer.draw(
				this.plugin.settings.sample,
				lightImg,
				this.plugin.settings.lightTheme
			);

			darkCard.empty();
			const darkImg = darkCard.createEl('img') as HTMLImageElement;
			darkImg.width = parseInt(this.plugin.settings.width);
			this.drawer.draw(
				this.plugin.settings.sample,
				darkImg,
				this.plugin.settings.darkTheme
			);
		};

		const onWidthChange = (width: string) => {
			div.style.gridTemplateColumns = `repeat(auto-fill, minmax(${width}px, 1fr)`;

			lightCard.empty();
			const lightImg = lightCard.createEl('img') as HTMLImageElement;
			lightImg.width = parseInt(width);
			this.drawer.draw(
				this.plugin.settings.sample,
				lightImg,
				this.plugin.settings.lightTheme
			);

			darkCard.empty();
			const darkImg = darkCard.createEl('img') as HTMLImageElement;
			darkImg.width = parseInt(width);
			this.drawer.draw(
				this.plugin.settings.sample,
				darkImg,
				this.plugin.settings.darkTheme
			);
		};

		const onLightStyleChange = (style: string) => {
			lightCard.empty();
			const img = lightCard.createEl('img') as HTMLImageElement;
			img.width = parseInt(this.plugin.settings.width);
			this.drawer.draw(this.plugin.settings.sample, img, style);
		};

		const onDarkStyleChange = (style: string) => {
			darkCard.empty();
			const img = darkCard.createEl('img') as HTMLImageElement;
			img.width = parseInt(this.plugin.settings.width);
			this.drawer.draw(this.plugin.settings.sample, img, style);
		};

		const onSampleChange = (example: string) => {
			lightCard.empty();
			const lightImg = lightCard.createEl('img') as HTMLImageElement;
			lightImg.width = parseInt(this.plugin.settings.width);
			this.drawer.draw(
				example,
				lightImg,
				this.plugin.settings.lightTheme
			);

			darkCard.empty();
			const darkImg = darkCard.createEl('img') as HTMLImageElement;
			darkImg.width = parseInt(this.plugin.settings.width);
			this.drawer.draw(example, darkImg, this.plugin.settings.darkTheme);
		};

		// initialize
		const initialize = (
			sample: string,
			width: string,
			lightTheme: string,
			darkTheme: string
		) => {
			lightCard.empty();
			const lightImg = lightCard.createEl('img') as HTMLImageElement;
			lightImg.width = parseInt(width == '' ? '300' : width);
			this.drawer.draw(
				sample == '' ? SAMPLE_SMILES : sample,
				lightImg,
				lightTheme == '' ? 'light' : lightTheme
			);

			darkCard.empty();
			const darkImg = darkCard.createEl('img') as HTMLImageElement;
			darkImg.width = parseInt(width == '' ? '300' : width);
			this.drawer.draw(
				sample == '' ? SAMPLE_SMILES : sample,
				darkImg,
				darkTheme == '' ? 'dark' : darkTheme
			);
		};
		initialize(
			this.plugin.settings.sample,
			this.plugin.settings.width,
			this.plugin.settings.lightTheme,
			this.plugin.settings.darkTheme
		);
	}

	hide(): void {
		// re-render
		// const blocks = Array.from(
		// 	document.getElementsByClassName('block-language-smiles')
		// );
		// this.root.unmount();
	}
}
