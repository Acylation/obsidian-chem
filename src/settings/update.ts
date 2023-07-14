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
	darkTheme: string;
	lightTheme: string;
	sample1: string;
	sample2: string;
	width: string;
	options: object;
}

const DEFAULT_SETTINGS_V2: ChemPluginSettingsV2 = {
	darkTheme: 'dark',
	lightTheme: 'light',
	sample1: 'OC(=O)C(C)=CC1=CC=CC=C1',
	sample2:
		'OC(C(=O)O[C@H]1C[N+]2(CCCOC3=CC=CC=C3)CCC1CC2)(C1=CC=CS1)C1=CC=CS1',
	width: '300',
	options: {},
};

export const migrate = (stale: ChemPluginSettingsV1 & ChemPluginSettingsV2) => {
	const result = { ...DEFAULT_SETTINGS_V2 };
	result.darkTheme = stale.darkTheme;
	result.lightTheme = stale.lightTheme;
	result.options = stale.options;
	//检查存在性
	result.sample1 = stale.sample;
	result.width = stale.width;
	return result;
};
