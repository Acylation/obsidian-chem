import { Plugin, MarkdownPostProcessorContext } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	ChemPluginSettings,
	SETTINGS_VERSION,
} from './settings/base';
import { ChemSettingTab } from './settings/SettingTab';
import { updateSettingsVersion } from './settings/update';
import { SmilesBlock } from './SmilesBlock';

import { setBlocks, clearBlocks } from './global/blocks';
import { setDrawer, clearDrawer } from './global/drawer';
import { getDataview, clearDataview } from './global/dataview';
import { setObserver, detachObserver } from './themeObserver';

export default class ChemPlugin extends Plugin {
	settings: ChemPluginSettings;

	async onload() {
		await this.loadSettings();

		// this.addRibbonIcon('hexagon', 'This is Chem Plugin', () => {});

		// initialize global variables
		setDrawer(this.settings.options);
		setBlocks();
		setObserver();

		this.addSettingTab(new ChemSettingTab({ app: this.app, plugin: this }));
		this.registerMarkdownCodeBlockProcessor('smiles', this.smilesProcessor);
		if (this.settings.dataview) getDataview();
	}

	async onunload() {
		detachObserver();
		clearBlocks();
		clearDrawer();
		clearDataview();
	}

	async loadSettings() {
		const candidate = Object.assign({}, await this.loadData());
		if ('version' in candidate && candidate.version == SETTINGS_VERSION)
			this.settings = Object.assign({}, DEFAULT_SETTINGS, candidate);
		else if (Object.keys(candidate).length === 0)
			this.settings = Object.assign({}, DEFAULT_SETTINGS);
		else
			this.settings = Object.assign(
				{},
				DEFAULT_SETTINGS,
				updateSettingsVersion(candidate)
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
		ctx.addChild(new SmilesBlock(el, source, ctx, this.settings));
	};
}
