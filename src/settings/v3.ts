import { SmilesDrawerOptions } from '../lib/core/smilesDrawerOptions';
import { RDKitOptions } from '../lib/core/rdkitOptions';

export interface ChemPluginSettingsV3 {
	version: string;
	darkTheme: string;
	lightTheme: string;
	sample1: string;
	sample2: string;
	copy: {
		scale: number;
		transparent: boolean;
		theme: string;
	};
	dataview: boolean;
	inlineSmiles: boolean;
	inlineSmilesPrefix: string;
	core: 'smiles-drawer' | 'rdkit';
	commonOptions: Partial<CommonOptions>;
	smilesDrawerOptions: SmilesDrawerOptions;
	rdkitOptions: Partial<RDKitOptions>;
}

interface CommonOptions {
	width: number;
	scale: number;
	unifiedWidth: number;
	compactDrawing: boolean;
	explicitHydrogens: boolean;
	explicitMethyl: boolean;
}

export const DEFAULT_SETTINGS_V3: ChemPluginSettingsV3 = {
	version: 'v3',
	darkTheme: 'dark',
	lightTheme: 'light',
	sample1: 'OC(=O)C(C)=CC1=CC=CC=C1',
	sample2: 'OC(C(=O)O[C@H]1C[N+]2(CCCOC3=CC=CC=C3)CCC1CC2)(C1=CC=CS1)C1=CC=CS1',
	copy: {
		scale: 2,
		transparent: true,
		theme: 'default',
	},
	dataview: false,
	inlineSmiles: false,
	inlineSmilesPrefix: '$smiles=',
	core: 'smiles-drawer',
	commonOptions: {
		width: 300,
		scale: 1,
		unifiedWidth: 300,
		compactDrawing: false,
		explicitHydrogens: false,
		explicitMethyl: false,
	},
	smilesDrawerOptions: {
		moleculeOptions: {},
		reactionOptions: {},
	},
	rdkitOptions: {},
};
