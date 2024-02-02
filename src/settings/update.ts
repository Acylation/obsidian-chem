interface ChemPluginSettingsV1 {
	darkTheme: string;
	lightTheme: string;
	sample: string;
	width: string;
}

// const DEFAULT_SETTINGS_V1: ChemPluginSettingsV1 = {
// 	darkTheme: 'dark',
// 	lightTheme: 'light',
// 	sample: 'CC(=O)NC1=C-C=C-C=C1-C(=O)O',
// 	width: '300',
// };

interface ChemPluginSettingsV2 {
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
	options: object;
}

const DEFAULT_SETTINGS_V2: ChemPluginSettingsV2 = {
	version: 'v2',
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
	options: {},
};

export const updateSettingsVersion = (stale: ChemPluginSettingsV1) => {
	const result = { ...DEFAULT_SETTINGS_V2 };
	result.darkTheme = stale.darkTheme;
	result.lightTheme = stale.lightTheme;
	result.sample1 = stale.sample;
	result.imgWidth = parseInt(stale.width);
	return result;
};
