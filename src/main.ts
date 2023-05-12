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

let options = {
	scale: 0,
	bondThickness: 1,
	shortBondLength: 0.8,
	bondSpacing: 5.1000000000000005,
	atomVisualization: 'default',
	isomeric: true,
	debug: false,
	terminalCarbons: false,
	explicitHydrogens: true,
	overlapSensitivity: 0.42,
	overlapResolutionIterations: 1,
	compactDrawing: true,
	fontFamily: 'Arial, Helvetica, sans-serif',
	fontSizeLarge: 11,
	fontSizeSmall: 3,
	padding: 2,
	experimentalSSSR: true,
	kkThreshold: 0.1,
	kkInnerThreshold: 0.1,
	kkMaxIteration: 20000,
	kkMaxInnerIteration: 50,
	kkMaxEnergy: 1000000000,
	themes: {
		dark: {
			C: '#fff',
			O: '#e74c3c',
			N: '#3498db',
			F: '#27ae60',
			CL: '#16a085',
			BR: '#d35400',
			I: '#8e44ad',
			P: '#d35400',
			S: '#f1c40f',
			B: '#e67e22',
			SI: '#e67e22',
			H: '#aaa',
			BACKGROUND: '#141414',
		},
		light: {
			C: '#222',
			O: '#e74c3c',
			N: '#3498db',
			F: '#27ae60',
			CL: '#16a085',
			BR: '#d35400',
			I: '#8e44ad',
			P: '#d35400',
			S: '#f1c40f',
			B: '#e67e22',
			SI: '#e67e22',
			H: '#666',
			BACKGROUND: '#fff',
		},
		oldschool: {
			C: '#000',
			O: '#000',
			N: '#000',
			F: '#000',
			CL: '#000',
			BR: '#000',
			I: '#000',
			P: '#000',
			S: '#000',
			B: '#000',
			SI: '#000',
			H: '#000',
			BACKGROUND: '#fff',
		},
		'oldschool-dark': {
			C: '#fff',
			O: '#fff',
			N: '#fff',
			F: '#fff',
			CL: '#fff',
			BR: '#fff',
			I: '#fff',
			P: '#fff',
			S: '#fff',
			B: '#fff',
			SI: '#fff',
			H: '#fff',
			BACKGROUND: '#000',
		},
		solarized: {
			C: '#586e75',
			O: '#dc322f',
			N: '#268bd2',
			F: '#859900',
			CL: '#16a085',
			BR: '#cb4b16',
			I: '#6c71c4',
			P: '#d33682',
			S: '#b58900',
			B: '#2aa198',
			SI: '#2aa198',
			H: '#657b83',
			BACKGROUND: '#fff',
		},
		'solarized-dark': {
			C: '#93a1a1',
			O: '#dc322f',
			N: '#268bd2',
			F: '#859900',
			CL: '#16a085',
			BR: '#cb4b16',
			I: '#6c71c4',
			P: '#d33682',
			S: '#b58900',
			B: '#2aa198',
			SI: '#2aa198',
			H: '#839496',
			BACKGROUND: '#fff',
		},
		matrix: {
			C: '#678c61',
			O: '#2fc079',
			N: '#4f7e7e',
			F: '#90d762',
			CL: '#82d967',
			BR: '#23755a',
			I: '#409931',
			P: '#c1ff8a',
			S: '#faff00',
			B: '#50b45a',
			SI: '#409931',
			H: '#426644',
			BACKGROUND: '#fff',
		},
		github: {
			C: '#24292f',
			O: '#cf222e',
			N: '#0969da',
			F: '#2da44e',
			CL: '#6fdd8b',
			BR: '#bc4c00',
			I: '#8250df',
			P: '#bf3989',
			S: '#d4a72c',
			B: '#fb8f44',
			SI: '#bc4c00',
			H: '#57606a',
			BACKGROUND: '#fff',
		},
		carbon: {
			C: '#161616',
			O: '#da1e28',
			N: '#0f62fe',
			F: '#198038',
			CL: '#007d79',
			BR: '#fa4d56',
			I: '#8a3ffc',
			P: '#ff832b',
			S: '#f1c21b',
			B: '#8a3800',
			SI: '#e67e22',
			H: '#525252',
			BACKGROUND: '#fff',
		},
		cyberpunk: {
			C: '#ea00d9',
			O: '#ff3131',
			N: '#0abdc6',
			F: '#00ff9f',
			CL: '#00fe00',
			BR: '#fe9f20',
			I: '#ff00ff',
			P: '#fe7f00',
			S: '#fcee0c',
			B: '#ff00ff',
			SI: '#ffffff',
			H: '#913cb1',
			BACKGROUND: '#fff',
		},
		gruvbox: {
			C: '#665c54',
			O: '#cc241d',
			N: '#458588',
			F: '#98971a',
			CL: '#79740e',
			BR: '#d65d0e',
			I: '#b16286',
			P: '#af3a03',
			S: '#d79921',
			B: '#689d6a',
			SI: '#427b58',
			H: '#7c6f64',
			BACKGROUND: '#fbf1c7',
		},
		'gruvbox-dark': {
			C: '#ebdbb2',
			O: '#cc241d',
			N: '#458588',
			F: '#98971a',
			CL: '#b8bb26',
			BR: '#d65d0e',
			I: '#b16286',
			P: '#fe8019',
			S: '#d79921',
			B: '#8ec07c',
			SI: '#83a598',
			H: '#bdae93',
			BACKGROUND: '#282828',
		},
		custom: {
			C: '#222',
			O: '#e74c3c',
			N: '#3498db',
			F: '#27ae60',
			CL: '#16a085',
			BR: '#d35400',
			I: '#8e44ad',
			P: '#d35400',
			S: '#f1c40f',
			B: '#e67e22',
			SI: '#e67e22',
			H: '#666',
			BACKGROUND: '#fff',
		},
	},
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
			const drawer = new SmilesDrawer.SmiDrawer(options);

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
					// const blocks = Array.from(
					// 	document.getElementsByClassName('block-language-smiles')
					// );
				} else if (
					mutation.oldValue?.contains('theme-light') &&
					target.classList.value.contains('theme-dark')
				) {
					//console.log('trigger dark');
					// const blocks = Array.from(
					// 	document.getElementsByClassName('block-language-smiles')
					// );
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
					.addOption('oldschool-dark', 'Oldschool Dark')
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
					.addOption('oldschool-dark', 'Oldschool Dark')
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

		const drawer = new SmilesDrawer.SmiDrawer(options);

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
