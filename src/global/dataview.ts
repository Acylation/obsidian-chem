import { isPluginEnabled } from 'obsidian-dataview';
import { i18n } from 'src/lib/i18n';

export let gDataview: any;
export { isPluginEnabled } from 'obsidian-dataview';

export const getDataview = () => {
	if (isPluginEnabled(app)) {
		gDataview = app.plugins.getPlugin('dataview');
	} else {
		throw new Error(i18n.t('errors.dataview.title'));
	}
};

export const clearDataview = () => {
	gDataview = null;
};
