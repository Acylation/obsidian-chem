import { Plugin, MarkdownPostProcessorContext } from 'obsidian';
import { DEFAULT_SETTINGS, ChemPluginSettings } from './settings/base';
import { ChemSettingTab } from './settings/SettingTab';
import { SmilesBlock } from './SmilesBlock';

import { setBlocks, clearBlocks } from './global/blocks';
import { setDrawer, clearDrawer } from './global/drawer';
import { setObserver, detachObserver } from './themeObserver';

export default class ChemPlugin extends Plugin {
	settings: ChemPluginSettings;

	async onload() {
		await this.loadSettings();

		//this.addRibbonIcon('hexagon', 'This is Chem Plugin', () => {});

		//initialize global variables
		setDrawer(this.settings.options);
		setBlocks();
		setObserver();

		//update settings

		this.addSettingTab(new ChemSettingTab({ app: this.app, plugin: this }));
		this.registerMarkdownCodeBlockProcessor('smiles', this.smilesProcessor);
	}

	async onunload() {
		detachObserver();
		clearBlocks();
		clearDrawer();
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

	smilesProcessor = (
		source: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext
	) => {
		ctx.addChild(new SmilesBlock(el, source, ctx, this.settings)); // pass plugin settings, maybe useful in react settings provider.
	};
}
