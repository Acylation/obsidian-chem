import { hex2RGB, type RGBDecimal } from './helpers';
import { SDTheme, SDThemes } from './smilesDrawerTheme';

export const themeList = {
	light: 'Light',
	dark: 'Dark',
	oldschool: 'Oldschool',
	'oldschool-dark': 'Oldschool Dark',
	solarized: 'Solarized',
	'solarized-dark': 'Solarized Dark',
	matrix: 'Matrix',
	github: 'GitHub',
	carbon: 'Carbon',
	cyberpunk: 'Cyberpunk',
	gruvbox: 'Gruvbox',
	'gruvbox-dark': 'Gruvbox Dark',
};

// themeMap = new Map(Object.entries(themeList))
// themeList = Object.fromEntries(themeMap)
// TODO: find way to register a new theme

export const getSmilesDrawerTheme = (name: keyof typeof SDThemes): SDTheme => {
	return SDThemes[name];
};

export const getRDKitTheme = (
	name: keyof typeof SDThemes
): Record<number, RGBDecimal> => {
	const t = SDThemes[name];
	const palette: Record<number, RGBDecimal> = {};
	themeKeysMap.forEach((v, k) => {
		palette[v] = hex2RGB(t[k]);
	});
	return palette;
};

const themeKeysMap: Map<keyof SDTheme, number> = new Map([
	['C', 6],
	['O', 8],
	['N', 7],
	['F', 9],
	['CL', 17],
	['BR', 35],
	['I', 53],
	['P', 15],
	['S', 16],
	['B', 5],
	['SI', 14],
	['H', 201],
	['BACKGROUND', -1],
]);
