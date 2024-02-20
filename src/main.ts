import { Plugin, MarkdownPostProcessorContext } from 'obsidian';
import { ChemPluginSettings } from './settings/base';
import { ChemSettingTab } from './settings/SettingTab';
import { migrateSettings } from './settings/base';
import { SmilesBlock } from './SmilesBlock';
import { inlinePlugin } from './SmilesInline';

import { setBlocks, clearBlocks } from './global/blocks';
import { setCore } from './global/chemCore';
import { getDataview, clearDataview } from './global/dataview';
import { setObserver, detachObserver } from './themeObserver';

export default class ChemPlugin extends Plugin {
	settings: ChemPluginSettings;

	async onload() {
		await this.loadSettings();

		// this.addRibbonIcon('hexagon', 'This is Chem Plugin', () => {});

		// initialize global variables
		setDrawer(
			this.settings.smilesDrawerOptions.moleculeOptions,
			this.settings.smilesDrawerOptions.reactionOptions
		);
		setBlocks();
		setObserver();
		// editor extension
		this.registerEditorExtension(inlinePlugin(this.settings));
		this.app.workspace.updateOptions();

		this.addSettingTab(new ChemSettingTab({ app: this.app, plugin: this }));
		this.registerMarkdownCodeBlockProcessor('smiles', this.smilesProcessor);
		this.registerMarkdownPostProcessor(this.inlineSmilesProcessor);
		if (this.settings.dataview) getDataview();
	}

	async onunload() {
		detachObserver();
		clearBlocks();
		clearDrawer();
		clearDataview();
	}

	async loadSettings() {
		this.settings = migrateSettings(await this.loadData());
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

	inlineSmilesProcessor = (
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext
	) => {
		//https://docs.obsidian.md/Plugins/Editor/Markdown+post+processing
		const inlineCodes = el.findAll('code');
		inlineCodes.forEach((code) => {
			const text = code.innerText;
			if (text.startsWith(this.settings.inlineSmilesPrefix)) {
				const source = text
					.substring(this.settings.inlineSmilesPrefix.length)
					.trim();
				const container = el.createDiv();
				code.replaceWith(container);
				ctx.addChild(
					new SmilesBlock(container, source, ctx, this.settings)
				);
			}
		});
	};
}
