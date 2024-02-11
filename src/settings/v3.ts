import { SD_MoleculeOptions, SD_ReactionOptions } from './smilesDrawerOptions';

export interface ChemPluginSettingsV3 {
	version: string;
	darkTheme: string;
	lightTheme: string;
	sample1: string;
	sample2: string;
	imgWidth: number;
	copy: {
		scale: number;
		transparent: boolean;
		theme: string;
	};
	dataview: boolean;
	inlineSmiles: boolean;
	inlineSmilesPrefix: string;
	smilesDrawerOptions: {
		moleculeOptions: Partial<SD_MoleculeOptions>;
		reactionOptions: Partial<SD_ReactionOptions>;
	};
	rdkitJsOptions: {};
}
export const DEFAULT_SETTINGS_V3: ChemPluginSettingsV3 = {
	version: 'v3',
	darkTheme: 'dark',
	lightTheme: 'light',
	sample1: 'OC(=O)C(C)=CC1=CC=CC=C1',
	sample2:
		'OC(C(=O)O[C@H]1C[N+]2(CCCOC3=CC=CC=C3)CCC1CC2)(C1=CC=CS1)C1=CC=CS1',
	imgWidth: 300,
	copy: {
		scale: 2,
		transparent: true,
		theme: 'default',
	},
	dataview: false,
	inlineSmiles: false,
	inlineSmilesPrefix: '$smiles=',
	smilesDrawerOptions: {
		moleculeOptions: {},
		reactionOptions: {},
	},
	rdkitJsOptions: {},
};
