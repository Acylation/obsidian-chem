import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import SmilesDrawer from 'smiles-drawer';

const sample_smiles = 'CC(=O)NC1=C-C=C-C=C1-C(=O)O';

interface ChemPluginSettings {
	width: string;
	darkTheme: string;
	lightTheme: string;
	sample: string;
}

const DEFAULT_SETTINGS: ChemPluginSettings = {
	width: '300',
	darkTheme: 'dark',
	lightTheme: 'light',
	sample: sample_smiles,
};

export default class ChemPlugin extends Plugin {
	settings: ChemPluginSettings;

	//TODO: update blocks after wrapping them
	//watch Obsidian theme changes
	//watch settings tab close
	//watch system media change
	//on code block updated

	// TODO: use svg
	// https://github.com/reymond-group/smilesDrawer/issues/167

	async onload() {
		await this.loadSettings();

		//this.addRibbonIcon('hexagon', 'This is Chem Plugin', () => {});

		this.addSettingTab(new ChemSettingTab(this.app, this));

		const renderBlocks = (
			source: string,
			container: HTMLElement,
			theme: string,
			width: string
		) => {
			// can put options in calling the drawer
			let drawer = new SmilesDrawer.SmiDrawer();

			// different behavior in live preview and view mode
			// under view mode, an extra '\n' is appended
			const rows = source.split('\n').filter((row) => row.length > 0);

			for (let i = 0; i < rows.length; i++) {
				const img = container.createEl('img') as HTMLImageElement;
				img.width = parseInt(width);
				drawer.draw(
					rows[i].trim(), // handle spaces in front of the string
					img,
					theme
				);
			}
		};

		this.registerMarkdownCodeBlockProcessor('smiles', (source, el, ctx) => {
			renderBlocks(
				source,
				el,
				document.body.hasClass('theme-dark') &&
					!document.body.hasClass('theme-light')
					? this.settings.darkTheme
					: this.settings.lightTheme,
				this.settings.width
			);
		});

		new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				const target = mutation.target as HTMLElement;
				if (
					mutation.oldValue?.contains('theme-dark') &&
					target.classList.value.contains('theme-light')
				) {
					//console.log('trigger light');
					let blocks = Array.from(
						document.getElementsByClassName('block-language-smiles')
					);
				} else if (
					mutation.oldValue?.contains('theme-light') &&
					target.classList.value.contains('theme-dark')
				) {
					//console.log('trigger dark');
					let blocks = Array.from(
						document.getElementsByClassName('block-language-smiles')
					);
				}
			});
		}).observe(document.body, {
			attributes: true,
			attributeOldValue: true,
			attributeFilter: ['class'],
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ChemSettingTab extends PluginSettingTab {
	plugin: ChemPlugin;

	constructor(app: App, plugin: ChemPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	//Reference: https://smilesdrawer.surge.sh/playground.html

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Style Preferences' });

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
			.setDesc('Active when Obsidian is under light mode')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('light', 'Light')
					.addOption('dark', 'Dark')
					.addOption('oldschool', 'Oldschool')
					.addOption('solarized', 'Solarized')
					.addOption('solarized-dark', 'Solarized Dark')
					//.addOption('oldschool-dark', 'Oldschool Dark')
					.addOption('matrix', 'Matrix')
					.addOption('github', 'GitHub')
					.addOption('carbon', 'Carbon')
					.addOption('cyberpunk', 'Cyberpunk')
					.addOption('gruvbox', 'Gruvbox')
					.addOption('gruvbox-dark', 'Gruvbox Dark')
					.setValue(this.plugin.settings.lightTheme)
					.onChange(async (value) => {
						this.plugin.settings.lightTheme = value;
						await this.plugin.saveSettings();
						onLightStyleChange(value);
					})
			);

		new Setting(containerEl)
			.setName('Dark Theme')
			.setDesc('Active when Obsidian is under dark mode')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('light', 'Light')
					.addOption('dark', 'Dark')
					.addOption('oldschool', 'Oldschool')
					//.addOption('oldschool-dark', 'Oldschool Dark')
					.addOption('solarized', 'Solarized')
					.addOption('solarized-dark', 'Solarized Dark')
					.addOption('matrix', 'Matrix')
					.addOption('github', 'GitHub')
					.addOption('carbon', 'Carbon')
					.addOption('cyberpunk', 'Cyberpunk')
					.addOption('gruvbox', 'Gruvbox')
					.addOption('gruvbox-dark', 'Gruvbox Dark')
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
					.setPlaceholder(sample_smiles)
					.setValue(this.plugin.settings.sample)
					.onChange(async (value) => {
						if (value == '') {
							value = sample_smiles;
						}
						this.plugin.settings.sample = value;
						await this.plugin.saveSettings();
						onSampleChange(value);
					})
			);

		let drawer = new SmilesDrawer.SmiDrawer();

		const div = containerEl.createEl('div');
		div.style.display = 'grid';
		div.style.gridTemplateColumns = `repeat(auto-fill, minmax(${this.plugin.settings.width}px, 1fr)`;

		const lightCard = div.createEl('div', { cls: 'chemcard theme-light' });
		const darkCard = div.createEl('div', { cls: 'chemcard theme-dark' });

		const onWidthChange = (width: string) => {
			div.style.gridTemplateColumns = `repeat(auto-fill, minmax(${width}px, 1fr)`;

			lightCard.empty();
			const lightImg = lightCard.createEl('img') as HTMLImageElement;
			lightImg.width = parseInt(width);
			drawer.draw(
				this.plugin.settings.sample,
				lightImg,
				this.plugin.settings.lightTheme
			);

			darkCard.empty();
			const darkImg = darkCard.createEl('img') as HTMLImageElement;
			darkImg.width = parseInt(width);
			drawer.draw(
				this.plugin.settings.sample,
				darkImg,
				this.plugin.settings.darkTheme
			);
		};

		const onLightStyleChange = (style: string) => {
			lightCard.empty();
			const img = lightCard.createEl('img') as HTMLImageElement;
			img.width = parseInt(this.plugin.settings.width);
			drawer.draw(this.plugin.settings.sample, img, style);
		};

		const onDarkStyleChange = (style: string) => {
			darkCard.empty();
			const img = darkCard.createEl('img') as HTMLImageElement;
			img.width = parseInt(this.plugin.settings.width);
			drawer.draw(this.plugin.settings.sample, img, style);
		};

		const onSampleChange = (example: string) => {
			lightCard.empty();
			const lightImg = lightCard.createEl('img') as HTMLImageElement;
			lightImg.width = parseInt(this.plugin.settings.width);
			drawer.draw(example, lightImg, this.plugin.settings.lightTheme);

			darkCard.empty();
			const darkImg = darkCard.createEl('img') as HTMLImageElement;
			darkImg.width = parseInt(this.plugin.settings.width);
			drawer.draw(example, darkImg, this.plugin.settings.darkTheme);
		};

		// Initialize
		const initialize = (
			sample: string,
			width: string,
			lightTheme: string,
			darkTheme: string
		) => {
			lightCard.empty();
			const lightImg = lightCard.createEl('img') as HTMLImageElement;
			lightImg.width = parseInt(width == '' ? '300' : width);
			drawer.draw(
				sample == '' ? sample_smiles : sample,
				lightImg,
				lightTheme == '' ? 'light' : lightTheme
			);

			darkCard.empty();
			const darkImg = darkCard.createEl('img') as HTMLImageElement;
			darkImg.width = parseInt(width == '' ? '300' : width);
			drawer.draw(
				sample == '' ? sample_smiles : sample,
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
}
