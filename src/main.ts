import { Plugin, MarkdownPostProcessorContext } from 'obsidian';
import { ChemPluginSettings, migrateSettings } from './settings/base';
import { ChemSettingTab } from './settings/SettingTab';

import { SmilesBlock } from './SmilesBlock';
import { inlinePlugin } from './SmilesInline';

import { setCore, clearCore, setFallbackCore } from './global/chemCore';
import { setBlocks, clearBlocks } from './global/blocks';
import { getDataview, clearDataview } from './global/dataview';
import { setObserver, detachObserver } from './lib/themes/themeObserver';
import { CoreFallbackModal } from './lib/core/coreFallbackModal';

export default class ChemPlugin extends Plugin {
	settings: ChemPluginSettings;

	async onload() {
		await this.loadSettings();

		// initialize global variables
		setBlocks();
		setObserver();
		setCore(this.settings, (error: string) => {
			new CoreFallbackModal(this.app, error, async () => {
				this.settings.core = 'smiles-drawer';
				await this.saveSettings();
				await setFallbackCore(this.settings);
			}).open();
		});

		this.addSettingTab(new ChemSettingTab({ app: this.app, plugin: this }));

		// render modules
		this.registerMarkdownCodeBlockProcessor('smiles', this.smilesProcessor);
		this.registerMarkdownPostProcessor(this.inlineSmilesProcessor); // nested inline render
		this.registerEditorExtension(inlinePlugin(this.settings)); // editor extension for patching live-preview inline
		this.app.workspace.updateOptions(); // Auto render existing pages when plugin loaded

		if (this.settings.dataview) getDataview();
	}

	async onunload() {
		detachObserver();
		clearBlocks();
		clearCore();
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

	//TODO: fix extra br in inline code
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
