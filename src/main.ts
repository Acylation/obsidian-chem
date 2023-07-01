import { Plugin } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	ChemPluginSettings,
	DEFAULT_SD_OPTIONS,
} from './settings/base';
import { ChemSettingTab } from './settings/SettingTab';
import SmilesDrawer from 'smiles-drawer';

export default class ChemPlugin extends Plugin {
	settings: ChemPluginSettings;

	themeObserver = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			const target = mutation.target as HTMLElement;
			if (
				// dark -> dark & light -> light
				mutation.oldValue?.contains('theme-dark') &&
				!mutation.oldValue?.contains('theme-light') && // key line, avoid calling twice
				target.classList.value.contains('theme-light')
			) {
				// console.log('trigger light');
				// const blocks = Array.from(
				// 	document.getElementsByClassName('block-language-smiles')
				// );
			} else if (
				// light -> empty -> dark
				mutation.oldValue?.contains('theme-light') && // key line, avoid calling twice
				!mutation.oldValue?.contains('theme-dark') &&
				target.classList.value.contains('theme-dark')
			) {
				// console.log('trigger dark');
				// const blocks = Array.from(
				// 	document.getElementsByClassName('block-language-smiles')
				// );
			}
		});
	});

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

		this.addSettingTab(new ChemSettingTab({ app: this.app, plugin: this }));

		const renderBlocks = (
			source: string,
			container: HTMLElement,
			theme: string,
			width: string,
			options?: object
		) => {
			// can put options in calling the drawer
			const drawer = new SmilesDrawer.SmiDrawer({
				...DEFAULT_SD_OPTIONS,
				...options,
			});

			// different behavior in live preview and view mode
			// under view mode, an extra '\n' is appended
			const rows = source.split('\n').filter((row) => row.length > 0);

			for (let i = 0; i < rows.length; i++) {
				const img = container.createEl('img') as HTMLImageElement;
				//img.width = parseInt(width);
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
				this.settings.width,
				this.settings.options
			);
		});

		this.themeObserver.observe(document.body, {
			attributes: true,
			attributeOldValue: true,
			attributeFilter: ['class'],
		});
	}

	async onunload() {
		this.themeObserver.disconnect();
	}

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
