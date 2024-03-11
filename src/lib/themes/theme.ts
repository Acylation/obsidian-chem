import { RDKitThemes } from './rdkitThemes';
import { SDTheme, SDThemes } from './smilesDrawerThemes';

import { hex2RGB, RGB2hex, type RGBDecimal } from './helpers';

export const themeList = {
	// from smiles-drawer
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

	// from RDKit
	'rdkit-default': 'Light (RDKit)',
	'rdkit-avalon': 'Avalon (RDKit)',
	'rdkit-cdk': 'CDK (RDKit)',
	'rdkit-dark': 'Dark (RDKit)',
};

export const convertToSDTheme = (
	name: keyof typeof SDThemes | keyof typeof RDKitThemes
): Record<string, string> => {
	if (Object.keys(SDThemes).includes(name)) {
		return SDThemes[name];
	} else if (Object.keys(RDKitThemes).includes(name)) {
		const p = RDKitThemes[name];
		const t: Record<string, string> = {};
		Keys_RD2SD.forEach((v, k) => {
			if (p[v]) t[k] = RGB2hex(p[v]);
		});
		t['BACKGROUND'] = getSDBGColor(name);
		return t;
	}
	return SDThemes['light'];
};

export const convertToRDKitTheme = (
	name: keyof typeof SDThemes | keyof typeof RDKitThemes
): Record<number, RGBDecimal> => {
	if (Object.keys(SDThemes).includes(name)) {
		const t = SDThemes[name];
		const p: Record<number, RGBDecimal> = {};
		Keys_SD2RD.forEach((v, k) => {
			p[k] = hex2RGB(t[v]);
		});
		return p;
	} else if (Object.keys(RDKitThemes).includes(name)) {
		return RDKitThemes[name];
	}
	return RDKitThemes['rdkit-default'];
};

// Get a hexString background color.
export const getSDBGColor = (name: string): string => {
	if (Object.keys(SDThemes).includes(name)) {
		const t = SDThemes[name];
		return t['BACKGROUND'];
	} else if (Object.keys(RDKitThemes).includes(name)) {
		return RGB2hex(RDKitThemes[name][6].map((v) => 1 - v) as RGBDecimal);
	}
	return '#000';
};

// Get a RGBDecimal background color.
export const getRDKitBGColor = (name: string): RGBDecimal => {
	if (Object.keys(SDThemes).includes(name)) {
		const t = SDThemes[name];
		return hex2RGB(t['BACKGROUND']);
	} else if (Object.keys(RDKitThemes).includes(name)) {
		return RDKitThemes[name][6].map((v) => 1 - v) as RGBDecimal;
	}
	return [0, 0, 0];
};

const Keys_RD2SD: Map<keyof SDTheme, number> = new Map([
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
	['H', 1],
]);

const Keys_SD2RD: Map<number, keyof SDTheme> = new Map([
	[-1, 'H'],
	[0, 'C'],
	[6, 'C'],
	[7, 'N'],
	[8, 'O'],
	[9, 'F'],
	[14, 'SI'],
	[15, 'P'],
	[16, 'S'],
	[17, 'CL'],
	[35, 'BR'],
	[53, 'I'],
	[5, 'B'],
	[201, 'H'],
]);
