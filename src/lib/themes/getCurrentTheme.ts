import { ChemPluginSettings } from 'src/settings/base';

export const getCurrentTheme = (settings: ChemPluginSettings) => {
	return document.body.hasClass('theme-dark') &&
		!document.body.hasClass('theme-light')
		? settings.darkTheme
		: settings.lightTheme;
};
