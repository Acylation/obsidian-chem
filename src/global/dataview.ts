import { isPluginEnabled } from 'obsidian-dataview';
import type { DataviewPlugin } from 'obsidian-dataview'; // modification on package index required
import { i18n } from 'src/lib/i18n';

export let gDataview: DataviewPlugin;
export { isPluginEnabled } from 'obsidian-dataview';

export const getDataview = () => {
	if (isPluginEnabled(app)) {
		//@ts-ignore
		gDataview = app.plugins.plugins.dataview;
	} else {
		gDataview;
		throw new Error(i18n.t('errors.dataview.title'));
	}
};

export const clearDataview = () => {
	gDataview = {};
};
